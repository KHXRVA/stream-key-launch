import socket
import threading
import time

def connect_proxy(proxy_host, proxy_port):
    """
    Connect to the proxy, handling both IPv4 and IPv6.
    """
    # Strip brackets if present for IPv6 literals
    if proxy_host.startswith('[') and proxy_host.endswith(']'):
        proxy_host = proxy_host[1:-1]

    for res in socket.getaddrinfo(proxy_host, proxy_port, socket.AF_UNSPEC, socket.SOCK_STREAM):
        af, socktype, proto, canonname, sa = res
        try:
            s = socket.socket(af, socktype, proto)
            s.connect(sa)
            return s
        except Exception as e:
            continue
    raise Exception(f"Cannot connect to proxy {proxy_host}:{proxy_port}")

def create_socks5_socket(proxy_host, proxy_port, dest_host, dest_port, proxy_user=None, proxy_pass=None):
    """
    Create a socket connection through a SOCKS5 proxy (with optional username/password authentication).
    Returns the connected socket ready for use.
    """
    s = connect_proxy(proxy_host, proxy_port)

    # SOCKS5 handshake
    if proxy_user is not None and proxy_pass is not None:
        s.sendall(b'\x05\x02\x00\x02')  # Methods: no auth (0) and user/pass (2)
        response = s.recv(2)
        if response[0] != 5:
            raise Exception(f"SOCKS5 version mismatch: {response}")
        method = response[1]
        if method == 2:
            # Username/password authentication
            auth_request = b'\x01' + bytes([len(proxy_user)]) + proxy_user.encode('utf-8') + \
                           bytes([len(proxy_pass)]) + proxy_pass.encode('utf-8')
            s.sendall(auth_request)
            auth_response = s.recv(2)
            if auth_response != b'\x01\x00':
                raise Exception(f"SOCKS5 authentication failed: {auth_response}")
        elif method == 0:
            pass  # No auth needed
        else:
            raise Exception(f"SOCKS5 unsupported method: {method}")
    else:
        s.sendall(b'\x05\x01\x00')  # Method: no auth (0)
        response = s.recv(2)
        if response != b'\x05\x00':
            raise Exception(f"SOCKS5 handshake failed: {response}")

    # SOCKS5 request: version 5, connect (1), reserved (0), domain (3)
    request = b'\x05\x01\x00\x03'
    request += bytes([len(dest_host)]) + dest_host.encode('utf-8')
    request += dest_port.to_bytes(2, 'big')
    s.sendall(request)

    # Response: version, reply, reserved, addr type
    response = s.recv(4)
    if response[:2] != b'\x05\x00':
        raise Exception(f"SOCKS5 request failed: {response}")

    addr_type = response[3]
    if addr_type == 1:  # IPv4
        s.recv(4)
    elif addr_type == 3:  # Domain
        addr_len = s.recv(1)[0]
        s.recv(addr_len)
    elif addr_type == 4:  # IPv6
        s.recv(16)
    else:
        raise Exception("Unknown address type")

    # Port
    s.recv(2)

    return s

def bot_thread(account, proxy, channel):
    try:
        parts = account.split(':')
        if len(parts) < 3:
            raise ValueError(f"Invalid account format: {account}")
        
        # Handle cases with extra 'oauth:' due to possible copy-paste errors
        if len(parts) > 3 and all(p == 'oauth' for p in parts[1:-1]):
            username = parts[0]
            token = parts[-1]
        else:
            if parts[1] != 'oauth':
                raise ValueError(f"Invalid account format (missing oauth): {account}")
            username = parts[0]
            token = parts[2]
        
        password = 'oauth:' + token

        proxy_host, proxy_port, proxy_user, proxy_pass = proxy
        proxy_str = f"{proxy_host}:{proxy_port}"
        if proxy_user:
            proxy_str = f"{proxy_user}:{proxy_pass}@{proxy_str}"
        print(f"Using proxy: {proxy_str} for {username}")

        dest_host = 'irc.chat.twitch.tv'
        dest_port = 6667  # Non-SSL for minimal traffic

        s = create_socks5_socket(proxy_host, proxy_port, dest_host, dest_port, proxy_user, proxy_pass)

        # Authenticate
        s.sendall(f"PASS {password}\r\n".encode('utf-8'))
        s.sendall(f"NICK {username}\r\n".encode('utf-8'))
        s.sendall(f"JOIN #{channel}\r\n".encode('utf-8'))

        print(f"Connected {username} to #{channel} via {proxy_str}")

        buf = ''
        while True:
            data = s.recv(4096)
            if not data:
                break
            buf += data.decode('utf-8', errors='ignore')
            while '\r\n' in buf:
                line, buf = buf.split('\r\n', 1)
                if line.startswith('PING '):
                    pong = 'PONG ' + line[5:]
                    s.sendall((pong + '\r\n').encode('utf-8'))
                # Ignore other messages to minimize traffic

        print(f"Disconnected {username}")

    except Exception as e:
        print(f"Error for {account}: {e}")

if __name__ == '__main__':
    # Example usage: python script.py
    # Assumes accounts.txt with lines like: username:oauth:token
    # proxies.txt with lines like: socks5://user:pass@host:port or user:pass@host:port or host:port (SOCKS5, supports IPv6)
    channel = input("Enter the Twitch channel name (without #): ").strip()

    with open('accounts.txt', 'r') as f:
        accounts = [line.strip() for line in f if line.strip()]

    with open('proxies.txt', 'r') as f:
        raw_proxies = [line.strip() for line in f if line.strip()]
        proxies = []
        for rp in raw_proxies:
            original_rp = rp
            if rp.startswith('socks5://'):
                rp = rp[10:]
            elif rp.startswith('socks5h://'):
                rp = rp[11:]
            
            proxy_user = None
            proxy_pass = None
            if '@' in rp:
                auth_part, netloc = rp.split('@', 1)
                if ':' in auth_part:
                    proxy_user, proxy_pass = auth_part.split(':', 1)
                else:
                    proxy_user = auth_part
                    proxy_pass = ''
            else:
                netloc = rp
            
            if ':' in netloc:
                host, port_str = netloc.rsplit(':', 1)
            else:
                host = netloc
                port_str = '1080'  # Default SOCKS5 port, but assume provided
            
            try:
                port = int(port_str)
            except ValueError:
                print(f"Invalid port in proxy: {original_rp}")
                continue
            
            host = host.strip()
            if host.startswith('[') and host.endswith(']'):
                host = host[1:-1]
            
            proxies.append((host, port, proxy_user, proxy_pass))

    if not proxies:
        raise ValueError("No valid proxies found.")

    # Pair accounts with proxies (cycle proxies if fewer)
    import itertools
    proxies_cycle = itertools.cycle(proxies)

    threads = []
    for acc in accounts:
        proxy = next(proxies_cycle)
        t = threading.Thread(target=bot_thread, args=(acc, proxy, channel))
        t.start()
        threads.append(t)
        time.sleep(0.5)  # Delay to avoid connection rate limits

    # Wait for all threads
    for t in threads:
        t.join()