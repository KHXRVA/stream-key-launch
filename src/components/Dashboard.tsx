import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  TrendingUp,
  LogOut
} from "lucide-react";
import LogsPanel from "./LogsPanel";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [streamerNick, setStreamerNick] = useState("");
  const [totalAccounts, setTotalAccounts] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [batchDelay, setBatchDelay] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [loadedAccounts, setLoadedAccounts] = useState(0);
  const [loadedProxies, setLoadedProxies] = useState(0);
  const [activeProcesses, setActiveProcesses] = useState(0);

  const handleStart = () => {
    setIsRunning(true);
    setActiveProcesses(parseInt(totalAccounts) || 0);
  };

  const handleStop = () => {
    setIsRunning(false);
    setActiveProcesses(0);
  };

  const handleLoadAccounts = () => {
    // Simulate loading accounts
    const count = Math.floor(Math.random() * 1000) + 100;
    setLoadedAccounts(count);
  };

  const handleLoadProxies = () => {
    // Simulate loading proxies
    const count = Math.floor(Math.random() * 500) + 50;
    setLoadedProxies(count);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">StreamUp Dashboard</h1>
            <p className="text-sm text-muted-foreground">Управление потоковыми подключениями</p>
          </div>
        </div>
        
        <Button variant="outline" onClick={onLogout} className="border-border/50">
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Configuration */}
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
                <div className="space-y-2">
                  <Label htmlFor="streamer">Никнейм стримера</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="streamer"
                      placeholder="Введите никнейм"
                      value={streamerNick}
                      onChange={(e) => setStreamerNick(e.target.value)}
                      className="pl-10 bg-muted/30"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="total">Всего аккаунтов</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

                <div className="space-y-2">
                  <Label htmlFor="batch">Аккаунтов в пачке</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

                <div className="space-y-2">
                  <Label htmlFor="delay">Задержка между пачками (сек)</Label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

              <Separator />

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleStart}
                  disabled={isRunning || !streamerNick}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Запустить
                </Button>

                <Button
                  onClick={handleStop}
                  disabled={!isRunning}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Остановить
                </Button>

                <Button
                  onClick={handleLoadAccounts}
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить аккаунты
                </Button>

                <Button
                  onClick={handleLoadProxies}
                  variant="outline"
                  className="border-accent/50 text-accent hover:bg-accent/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить прокси
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account & Proxy Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-effect border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Аккаунты</CardTitle>
                <CardDescription className="text-sm">
                  Формат: username:oauth:token или oauth:token или token
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Вставьте аккаунты здесь..."
                  className="min-h-[120px] bg-muted/30 resize-none"
                />
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Прокси (SOCKS5)</CardTitle>
                <CardDescription className="text-sm">
                  Формат: user:pass@ip:port
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Вставьте прокси здесь..."
                  className="min-h-[120px] bg-muted/30 resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="space-y-4">
            <Card className="glass-effect border-border/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Аккаунты</p>
                      <p className="text-2xl font-bold">{loadedAccounts.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Загружено</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Прокси</p>
                      <p className="text-2xl font-bold">{loadedProxies.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Готово</Badge>
                </div>
              </CardContent>
            </Card>

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
                  <Badge 
                    variant={isRunning ? "default" : "secondary"}
                    className={isRunning ? "bg-success text-success-foreground" : ""}
                  >
                    {isRunning ? "Работает" : "Остановлено"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Indicator */}
          <Card className="glass-effect border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span>Статус системы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Режим:</span>
                  <span className={isRunning ? "text-success" : "text-muted-foreground"}>
                    {isRunning ? "Активный" : "Ожидание"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Стримера:</span>
                  <span>{streamerNick || "Не указан"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Пачки:</span>
                  <span>{batchSize || "Не указано"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logs Panel */}
      <LogsPanel />
    </div>
  );
};

export default Dashboard;