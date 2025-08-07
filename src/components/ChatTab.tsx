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
}

const ChatTab = ({ loadedAccounts, loadedProxies }: ChatTabProps) => {
  const [message, setMessage] = useState("");
  const [currentAccount, setCurrentAccount] = useState("StreamBot_001");
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
  const [maxMessages] = useState(500); // Twitch standard
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
      // Keep only last maxMessages (Twitch standard: 500)
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
    <div className="h-full overflow-auto">
      <div className="flex gap-4 p-4">
        {/* Left Panel - Settings */}
        <div className="w-80 space-y-4">
          <Card className="glass-effect border-border/20">
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

        {/* Center Panel - Stream Window + Resources Below */}
        <div className="flex-1 space-y-4">
          {/* Stream Window */}
          <Card className="glass-effect border-border/20">
            <CardHeader className="pb-3">
              <CardTitle>Окно стрима</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-video bg-muted/20 rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>Здесь будет окно стрима (16:9)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Panel */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-effect border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Аккаунты</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-8"
                  onClick={() => setShowAccountsList(!showAccountsList)}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>Список ботов</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {loadedAccounts}
                    </Badge>
                    {showAccountsList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                </Button>
                
                {showAccountsList && (
                  <Card className="mt-2 border">
                    <CardContent className="p-2 space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                        <Input
                          placeholder="Поиск бота..."
                          value={searchBot}
                          onChange={(e) => setSearchBot(e.target.value)}
                          className="pl-7 text-xs h-7"
                        />
                      </div>
                      <ScrollArea className="h-32">
                        <div className="space-y-1">
                          {filteredBots.map((bot) => (
                            <Button
                              key={bot}
                              variant={currentAccount === bot ? "secondary" : "ghost"}
                              className="w-full justify-start text-xs h-6 px-2"
                              onClick={() => {
                                setCurrentAccount(bot);
                                setShowAccountsList(false);
                              }}
                            >
                              {bot}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Прокси:</span>
                  <Badge variant="secondary" className="text-xs">{loadedProxies}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Состояние:</span>
                  <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                    {isConnected ? "Активен" : "Неактивен"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Сообщений:</span>
                  <span className="text-xs font-medium">{messages.length}/{maxMessages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Ботов онлайн:</span>
                  <span className="text-xs font-medium">
                    {isConnected ? Math.floor(Math.random() * 50) + 10 : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="w-80">
          <Card className="glass-effect border-border/20 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Чат стрима</CardTitle>
                <Badge 
                  variant={isConnected ? "default" : "secondary"}
                  className={isConnected ? "bg-success text-success-foreground" : ""}
                >
                  {isConnected ? "●" : "○"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3 p-3" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Messages - Fixed height with scroll */}
              <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 400px)' }} ref={scrollAreaRef}>
                <div className="space-y-1 pr-2">
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
              </ScrollArea>

              {/* Message Input */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-muted-foreground">От:</span>
                  <span className="font-medium text-primary">{currentAccount}</span>
                </div>
                <div className="flex space-x-1">
                  <Input
                    placeholder={isConnected ? "Сообщение..." : "Подключитесь"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                    className="text-xs h-8"
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
              </div>
              
              {/* Connection Button */}
              <Button
                onClick={toggleConnection}
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                className={!isConnected ? "bg-success hover:bg-success/90 text-success-foreground" : ""}
              >
                {isConnected ? "Отключить" : "Подключить"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;