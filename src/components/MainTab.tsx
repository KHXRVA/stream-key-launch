import { useState, useRef, useEffect } from "react";
import { useAppState, Account, Proxy as ProxyType } from "@/lib/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Square, 
  Upload, 
  Users, 
  Zap, 
  Activity, 
  Timer,
  Hash,
  User,
  TrendingUp
} from "lucide-react";
import LogsPanel from "./LogsPanel";

interface MainTabProps {
  loadedAccounts: number;
  loadedProxies: number;
  onLoadAccounts: () => void;
  onLoadProxies: () => void;
  onStreamerChange: (nick: string) => void;
}

const MainTab = ({ onStreamerChange }: MainTabProps) => {
  const { setAccounts, setProxies, accounts, proxies } = useAppState();
  const [accountsText, setAccountsText] = useState("");
  const [proxiesText, setProxiesText] = useState("");
  const fileInputAccRef = useRef<HTMLInputElement>(null);
  const fileInputProxyRef = useRef<HTMLInputElement>(null);

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);
  
  useEffect(() => {
    localStorage.setItem("proxies", JSON.stringify(proxies));
  }, [proxies]);
  
  // Восстанавливаем при монтировании
  useEffect(() => {
    const acc = localStorage.getItem("accounts");
    if (acc) setAccounts(JSON.parse(acc));
    const prx = localStorage.getItem("proxies");
    if (prx) setProxies(JSON.parse(prx));
    // eslint-disable-next-line
  }, []);

  const [accountsValid, setAccountsValid] = useState<Account[]>([]);
  const [accountsInvalid, setAccountsInvalid] = useState<string[]>([]);
  const [proxiesValid, setProxiesValid] = useState<ProxyType[]>([]);
  const [proxiesInvalid, setProxiesInvalid] = useState<string[]>([]);

  function parseAccounts(text: string): [Account[], string[]] {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const valid: Account[] = [];
    const invalid: string[] = [];
    for (const line of lines) {
      const parts = line.split(":");
      if (parts.length === 3) {
        // username:oauth:token
        valid.push({ username: parts[0], oauth: parts[2] });
      } else if (parts.length === 2) {
        // oauth:token
        valid.push({ oauth: parts[1] });
      } else if (parts.length === 1 && parts[0]) {
        // token
        valid.push({ oauth: parts[0] });
      } else {
        invalid.push(line);
      }
    }
    return [valid, invalid];
  }

  function parseProxies(text: string): [ProxyType[], string[]] {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const valid: ProxyType[] = [];
    const invalid: string[] = [];
    for (const line of lines) {
      // user:pass@ip:port
      const match = line.match(/^(?:(\w+):(\w+)@)?([\w.:-]+):(\d+)$/);
      if (match) {
        const [, user, pass, ip, port] = match;
        valid.push({ user, pass, ip, port });
      } else {
        invalid.push(line);
      }
    }
    return [valid, invalid];
  }

  const handleAccountsChange = (val: string) => {
    setAccountsText(val);
    const [valid, invalid] = parseAccounts(val);
    setAccountsValid(valid);
    setAccountsInvalid(invalid);
  };

  const handleProxiesChange = (val: string) => {
    setProxiesText(val);
    const [valid, invalid] = parseProxies(val);
    setProxiesValid(valid);
    setProxiesInvalid(invalid);
  };

  const handleLoadAccounts = () => {
    if (fileInputAccRef.current) fileInputAccRef.current.click();
  };
  
  const handleFileAccounts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const [valid, invalid] = parseAccounts(text);
      setAccounts(valid);
      setAccountsValid(valid);
      setAccountsInvalid(invalid);
      setAccountsText("");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleLoadProxies = () => {
    if (fileInputProxyRef.current) fileInputProxyRef.current.click();
  };
  
  const handleFileProxies = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const [valid] = parseProxies(text);
      setProxies(valid);
      setProxiesText("");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const [streamerNick, setStreamerNick] = useState("");
  const [totalAccounts, setTotalAccounts] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [batchDelay, setBatchDelay] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeProcesses, setActiveProcesses] = useState(0);

  // propagate change upward
  useEffect(() => {
    onStreamerChange(streamerNick.trim());
  }, [streamerNick, onStreamerChange]);

  const handleStart = () => {
    setIsRunning(true);
    setActiveProcesses(parseInt(totalAccounts) || 0);
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveProcesses(0);
  };

  return (
    <ScrollArea style={{ height: 'calc(100vh - 140px)' }} className="overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* Левая часть (управление) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Настройки стрима */}
          <Card className="glass-effect border-border/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Настройки стрима</span>
              </CardTitle>
              <CardDescription>
                Укажите параметры для подключения к стриму
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nick */}
                <div className="space-y-2">
                  <Label htmlFor="streamer">Никнейм стримера</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="streamer"
                      placeholder="Введите никнейм"
                      value={streamerNick}
                      onChange={(e) => setStreamerNick(e.target.value)}
                      className="pl-10 bg-muted/30"
                    />
                  </div>
                </div>
                {/* total accs */}
                <div className="space-y-2">
                  <Label htmlFor="total">Всего аккаунтов</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="total"
                      type="number"
                      placeholder="1000"
                      value={totalAccounts}
                      onChange={(e) => setTotalAccounts(e.target.value)}
                      className="pl-10 bg-muted/30"
                    />
                  </div>
                </div>
                {/* batch size */}
                <div className="space-y-2">
                  <Label htmlFor="batch">Аккаунтов в пачке</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="batch"
                      type="number"
                      placeholder="50"
                      value={batchSize}
                      onChange={(e) => setBatchSize(e.target.value)}
                      className="pl-10 bg-muted/30"
                    />
                  </div>
                </div>
                {/* delay */}
                <div className="space-y-2">
                  <Label htmlFor="delay">Задержка между пачками (сек)</Label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="delay"
                      type="number"
                      placeholder="5"
                      value={batchDelay}
                      onChange={(e) => setBatchDelay(e.target.value)}
                      className="pl-10 bg-muted/30"
                    />
                  </div>
                </div>
              </div>
              {/* Start / Stop */}
              <div className="flex gap-4 pt-2">
                <Button onClick={handleStart} disabled={isRunning} className="flex items-center gap-2">
                  <Play className="w-4 h-4" /> Старт
                </Button>
                <Button onClick={handleStop} disabled={!isRunning} variant="destructive" className="flex items-center gap-2">
                  <Square className="w-4 h-4" /> Стоп
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Accounts & Proxies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accounts Card */}
            <Card className="glass-effect border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Аккаунты</span>
                </CardTitle>
                <CardDescription>
                  Вставьте аккаунты в формате username:oauth:token или oauth:token
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Вставьте аккаунты здесь..."
                  className="min-h-[120px] bg-muted/30 resize-none"
                  value={accountsText}
                  onChange={(e) => handleAccountsChange(e.target.value)}
                />
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="text-success">Загружено: {accounts.length}</span>
                  {accountsInvalid.length > 0 && (
                    <span className="text-destructive">Ошибок: {accountsInvalid.length}</span>
                  )}
                  <Button variant="outline" size="sm" className="ml-auto" onClick={handleLoadAccounts}>
                    <Upload className="w-4 h-4 mr-2" />Загрузить из файла
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Proxies Card */}
            <Card className="glass-effect border-border/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span>Прокси</span>
                </CardTitle>
                <CardDescription>
                  Вставьте прокси в формате user:pass@ip:port
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Вставьте прокси здесь..."
                  className="min-h-[120px] bg-muted/30 resize-none"
                  value={proxiesText}
                  onChange={(e) => handleProxiesChange(e.target.value)}
                />
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="text-success">Загружено: {proxies.length}</span>
                  {proxiesInvalid.length > 0 && (
                    <span className="text-destructive">Ошибок: {proxiesInvalid.length}</span>
                  )}
                  <Button variant="outline" size="sm" className="ml-auto" onClick={handleLoadProxies}>
                    <Upload className="w-4 h-4 mr-2" />Загрузить из файла
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Правая колонка (статистика) */}
        <div className="space-y-6">
          {/* Accounts stat */}
          <Card className="glass-effect border-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Аккаунты</p>
                    <p className="text-2xl font-bold">{accounts.length.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="secondary">Загружено</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Proxies stat */}
          <Card className="glass-effect border-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Прокси</p>
                    <p className="text-2xl font-bold">{proxies.length.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="secondary">Готово</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Active */}
          <Card className="glass-effect border-border/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-success/20">
                    <Activity className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Активные</p>
                    <p className="text-2xl font-bold">{activeProcesses.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-success text-success-foreground" : ""}>
                  {isRunning ? "Работает" : "Остановлено"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Status card */}
          <Card className="glass-effect border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span>Статус системы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Режим:</span>
                <span className={isRunning ? "text-success" : "text-muted-foreground"}>{isRunning ? "Активный" : "Ожидание"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Логи */}
        <div className="lg:col-span-3">
          <LogsPanel />
        </div>
      </div>

      {/* hidden file inputs */}
      <input 
        type="file" 
        accept=".txt" 
        ref={fileInputAccRef} 
        className="hidden" 
        onChange={handleFileAccounts} 
      />
      <input 
        type="file" 
        accept=".txt" 
        ref={fileInputProxyRef} 
        className="hidden" 
        onChange={handleFileProxies} 
      />
    </ScrollArea>
  );
};

export default MainTab;