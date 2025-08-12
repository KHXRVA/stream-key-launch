import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Send, 
  MessageCircle, 
  Users, 
  Zap, 
  Clock,
  Search,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  nickname: string;
  timestamp: Date;
}

interface ChatTabProps {
  loadedAccounts: number;
  loadedProxies: number;
  channelName: string;
}

import { useAppState } from "@/lib/state";

const ChatTab = ({ loadedAccounts, loadedProxies, channelName }: ChatTabProps) => {
  const embedChannel = channelName || "twitch";
  // Корректно вычисляем parent для Twitch iframe
  const parentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const { accounts } = useAppState();
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState(accounts[0]?.username || accounts[0]?.oauth || "");
  const [searchBot, setSearchBot] = useState("");
  const [showAccountsList, setShowAccountsList] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [autoClear, setAutoClear] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTime, setShowTime] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Привет всем в чате!",
      nickname: "StreamUser1",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "2", 
      message: "Как дела? Стрим огонь!",
      nickname: "ViewerBot",
      timestamp: new Date(Date.now() - 3 * 60 * 1000)
    },
    {
      id: "3",
      message: "Спасибо за контент!",
      nickname: "ChatBot123",
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]);

  // Синхронизируем currentAccount при изменении аккаунтов
  useEffect(() => {
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]?.username || accounts[0]?.oauth || "");
    } else {
      setCurrentAccount("");
    }
  }, [accounts]);
  const [maxMessages] = useState(100); // Store max 100 messages
  const [chatSpeed, setChatSpeed] = useState("normal");
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [showBadges, setShowBadges] = useState(true);
  const [fontSize, setFontSize] = useState("medium");
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  
  // Mock bot accounts
  const botAccounts = Array.from({ length: loadedAccounts }, (_, i) => `StreamBot_${String(i + 1).padStart(3, '0')}`);
  const filteredBots = botAccounts.filter(bot => 
    bot.toLowerCase().includes(searchBot.toLowerCase())
  );

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      nickname: currentAccount,
      timestamp: new Date()
    };

    setMessages(prev => {
      const newMessages = [...prev, newMessage];
      // Keep only last 100 messages as requested
      return newMessages.slice(-maxMessages);
    });
    
    if (autoClear) {
      setMessage("");
    }
    
    if (autoSwitch) {
      const currentIndex = botAccounts.indexOf(currentAccount);
      const nextIndex = (currentIndex + 1) % botAccounts.length;
      setCurrentAccount(botAccounts[nextIndex]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-140px)] overflow-y-auto">
    <div className="flex flex-row h-full">
      {/* Левая панель — аккаунты и подключение */}
      <div className="w-72 min-w-[220px] max-w-xs flex flex-col gap-4 p-4">
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Аккаунты</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{accounts.length}</Badge>
              <span className="text-muted-foreground text-xs">загружено</span>
            </div>
            {accounts.length === 0 && (
              <div className="text-destructive text-xs mb-2 font-semibold">Нет загруженных аккаунтов! Загрузите их во вкладке "Главная".</div>
            )}
            <Button
              onClick={toggleConnection}
              variant={isConnected ? "destructive" : "default"}
              size="sm"
              className={isConnected ? "mt-2 bg-destructive text-destructive-foreground" : "mt-2 bg-success hover:bg-success/90 text-success-foreground"}
              disabled={accounts.length === 0}
            >
              {isConnected ? "Отключить" : "Подключить"}
            </Button>
          </CardContent>
        </Card>

        {/* Настройки чата */}
        <Card className="glass-effect border-border/20 mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Настройки чата</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Автосмена аккаунта</span>
              <Switch checked={autoSwitch} onCheckedChange={setAutoSwitch} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Автоочистка поля</span>
              <Switch checked={autoClear} onCheckedChange={setAutoClear} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Автопрокрутка</span>
              <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Показывать время</span>
              <Switch checked={showTime} onCheckedChange={setShowTime} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Звуковые уведомления</span>
              <Switch checked={soundNotifications} onCheckedChange={setSoundNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Показывать значки</span>
              <Switch checked={showBadges} onCheckedChange={setShowBadges} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Скорость чата</span>
              <select 
                value={chatSpeed} 
                onChange={(e) => setChatSpeed(e.target.value)}
                className="bg-background border border-border rounded px-2 py-1 text-xs"
              >
                <option value="slow">Медленно</option>
                <option value="normal">Нормально</option>
                <option value="fast">Быстро</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Размер шрифта</span>
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-background border border-border rounded px-2 py-1 text-xs"
              >
                <option value="small">Маленький</option>
                <option value="medium">Средний</option>
                <option value="large">Большой</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Центр — стрим */}
      <div className="flex-1 flex p-4 min-w-0">
        <Card className="glass-effect border-border/20 flex-1 flex">
          <CardContent className="p-0 flex-1">
            <iframe
              src={`https://player.twitch.tv/?channel=${embedChannel}&parent=${parentDomain}&muted=true`}
              height="100%"
              width="100%"
              allowFullScreen
              className="rounded-lg border border-border/20"
            />
          </CardContent>
        </Card>
      </div>

      {/* Правая панель — чат */}
      <div className="w-80 max-w-sm flex flex-col p-4 gap-4 min-w-[260px]">
        <Card className="glass-effect border-border/20 flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span>Чат стрима</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-[400px]">
            {/* Сообщения с фиксированной высотой и скроллом */}
            <div className="flex-1 overflow-y-auto h-[350px] mb-2 pr-2" ref={scrollAreaRef}>
              <div className="space-y-1">
                {messages.map((msg) => (
                  <div key={msg.id} className={`text-xs ${fontSize === 'small' ? 'text-[10px]' : fontSize === 'large' ? 'text-sm' : 'text-xs'}`}>
                    <div className="flex items-baseline space-x-1">
                      {showTime && (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTime(msg.timestamp)}
                        </span>
                      )}
                      {showBadges && (
                        <span className="w-3 h-3 bg-primary/20 rounded-sm shrink-0"></span>
                      )}
                      <span className="font-medium text-primary shrink-0">
                        {msg.nickname}:
                      </span>
                      <span className="break-words">
                        {msg.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ввод сообщения */}
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder={isConnected ? "Сообщение..." : "Подключитесь"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                className="text-xs h-8 flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ScrollArea>
  );
};

export default ChatTab;