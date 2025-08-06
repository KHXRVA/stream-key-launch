import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Terminal, 
  Trash2, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Info,
  XCircle
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const LogsPanel = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate log generation
  useEffect(() => {
    const generateLog = () => {
      const messages = [
        { type: 'info' as const, message: 'Подключение к серверу установлено' },
        { type: 'success' as const, message: 'Аккаунт успешно подключен к стриму' },
        { type: 'warning' as const, message: 'Превышен лимит соединений для IP' },
        { type: 'error' as const, message: 'Ошибка авторизации аккаунта' },
        { type: 'info' as const, message: 'Отправка пачки из 50 аккаунтов' },
        { type: 'success' as const, message: 'Прокси сервер отвечает нормально' },
        { type: 'info' as const, message: 'Обработка следующей пачки аккаунтов' },
        { type: 'warning' as const, message: 'Высокая нагрузка на прокси' },
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('ru-RU'),
        type: randomMessage.type,
        message: randomMessage.message
      };

      setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep only last 100 logs
    };

    const interval = setInterval(generateLog, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to newest logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logData = logs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `streamup-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-accent" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getLogBadgeVariant = (type: LogEntry['type']) => {
    switch (type) {
      case 'info':
        return 'secondary';
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="glass-effect border-border/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Логи системы</CardTitle>
            <Badge variant="outline" className="ml-2">
              {logs.length}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="border-border/50"
            >
              <Download className="w-4 h-4 mr-1" />
              Экспорт
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="border-border/50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Очистить
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-80" ref={scrollRef}>
          <div className="p-4 space-y-2">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Логи появятся после запуска системы</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={log.id}>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      {getLogIcon(log.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Badge 
                          variant={getLogBadgeVariant(log.type)}
                          className={`text-xs uppercase ${
                            log.type === 'success' ? 'bg-success text-success-foreground' : ''
                          }`}
                        >
                          {log.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-foreground break-words">
                        {log.message}
                      </p>
                    </div>
                  </div>
                  
                  {index < logs.length - 1 && (
                    <Separator className="my-2 opacity-30" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LogsPanel;