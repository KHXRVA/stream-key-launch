import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  MessageCircle, 
  Users, 
  Zap, 
  Clock
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
}

const ChatTab = ({ loadedAccounts, loadedProxies }: ChatTabProps) => {
  const [message, setMessage] = useState("");
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
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      nickname: "YourBot",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Чат стрима</span>
              </CardTitle>
              <Badge 
                variant={isConnected ? "default" : "secondary"}
                className={isConnected ? "bg-success text-success-foreground" : ""}
              >
                {isConnected ? "Подключен" : "Отключен"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-[400px] w-full rounded-md border border-border/20 p-4">
              <div ref={scrollAreaRef} className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary">
                        {msg.nickname}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm bg-muted/30 rounded-lg p-2 ml-4">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={isConnected ? "Введите сообщение..." : "Подключитесь к чату для отправки сообщений"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
                className="bg-muted/30"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Connection Controls */}
            <div className="flex justify-center">
              <Button
                onClick={toggleConnection}
                variant={isConnected ? "destructive" : "default"}
                className={!isConnected ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
              >
                {isConnected ? "Отключиться от чата" : "Подключиться к чату"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Status Panel */}
      <div className="space-y-4">
        <Card className="glass-effect border-border/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Статус чата</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Состояние:</span>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Активен" : "Неактивен"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Сообщений:</span>
              <span className="text-sm font-medium">{messages.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ботов онлайн:</span>
              <span className="text-sm font-medium">{isConnected ? Math.floor(Math.random() * 50) + 10 : 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Resources Status */}
        <Card className="glass-effect border-border/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ресурсы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Аккаунты</span>
              </div>
              <Badge variant="secondary">{loadedAccounts.toLocaleString()}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Прокси</span>
              </div>
              <Badge variant="secondary">{loadedProxies.toLocaleString()}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Chat Settings */}
        <Card className="glass-effect border-border/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Настройки чата</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Автопрокрутка</span>
              <Badge variant="outline">Включена</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Время сообщений</span>
              <Badge variant="outline">Показывать</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Никнеймы</span>
              <Badge variant="outline">Отображать</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatTab;