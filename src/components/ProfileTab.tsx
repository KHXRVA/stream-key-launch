import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Key, 
  Calendar, 
  Activity, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  MessageSquare,
  ExternalLink,
  Save
} from "lucide-react";

interface ProfileTabProps {
  onLogout: () => void;
}

const ProfileTab = ({ onLogout }: ProfileTabProps) => {
  const [defaultNickname, setDefaultNickname] = useState("");
  const [defaultAccounts, setDefaultAccounts] = useState("");
  const [defaultBatch, setDefaultBatch] = useState("");
  const [defaultDelay, setDefaultDelay] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Mock data
  const userKey = "SK_7f9d8e6a2b5c3f1a9e8d7c6b5a4f3e2d1c9b8a7f6e5d4c3b2a1f9e8d7c6b5a";
  const keyExpiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  const activityHistory = [
    { id: 1, action: "Запуск накрутки", streamer: "example_streamer", accounts: 500, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 2, action: "Остановка процесса", streamer: "test_user", accounts: 300, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 3, action: "Загрузка аккаунтов", streamer: "-", accounts: 1000, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    { id: 4, action: "Ошибка подключения", streamer: "failed_stream", accounts: 0, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
  ];

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log("Settings saved:", { defaultNickname, defaultAccounts, defaultBatch, defaultDelay, isDarkMode });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContactSupport = () => {
    window.open('https://t.me/twitchbooster_sup', '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Info & Settings */}
      <div className="lg:col-span-2 space-y-6">
        {/* User Info */}
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Информация о ключе</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Текущий ключ</Label>
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <code className="text-xs bg-muted/30 px-2 py-1 rounded font-mono">
                    {userKey.substring(0, 20)}...
                  </code>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-muted-foreground">Срок действия</Label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(keyExpiration)}</span>
                  <Badge variant="outline" className="text-success border-success/50">
                    Активен
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Settings */}
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>Настройки по умолчанию</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-nick">Никнейм по умолчанию</Label>
                <Input
                  id="default-nick"
                  placeholder="Введите никнейм"
                  value={defaultNickname}
                  onChange={(e) => setDefaultNickname(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-accounts">Аккаунтов по умолчанию</Label>
                <Input
                  id="default-accounts"
                  type="number"
                  placeholder="1000"
                  value={defaultAccounts}
                  onChange={(e) => setDefaultAccounts(e.target.value)}
                  className="bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-batch">Размер пачки</Label>
                <Input
                  id="default-batch"
                  type="number"
                  placeholder="50"
                  value={defaultBatch}
                  onChange={(e) => setDefaultBatch(e.target.value)}
                  className="bg-muted/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-delay">Задержка (сек)</Label>
                <Input
                  id="default-delay"
                  type="number"
                  placeholder="5"
                  value={defaultDelay}
                  onChange={(e) => setDefaultDelay(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
            </div>

            <Separator />

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label htmlFor="theme-toggle">Темная тема</Label>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>

            <Separator />

            {/* Save Settings */}
            <Button onClick={handleSaveSettings} className="w-full bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Сохранить настройки
            </Button>
          </CardContent>
        </Card>

        {/* Support & Logout */}
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>Поддержка</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Есть вопросы или нужна помощь? Свяжитесь с нашей службой поддержки.
            </p>
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleContactSupport}
                variant="outline"
                className="flex-1 border-accent/50 text-accent hover:bg-accent/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Написать в поддержку
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
              
              <Button 
                onClick={onLogout}
                variant="destructive"
                className="flex-1"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти из аккаунта
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity History */}
      <div className="space-y-6">
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>История активности</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityHistory.map((activity) => (
                <div key={activity.id} className="border-l-2 border-primary/30 pl-4 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{activity.action}</span>
                    <Badge 
                      variant={activity.action.includes('Ошибка') ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.action.includes('Ошибка') ? 'Ошибка' : 'Успешно'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.streamer !== '-' && (
                      <p>Стример: {activity.streamer}</p>
                    )}
                    {activity.accounts > 0 && (
                      <p>Аккаунтов: {activity.accounts}</p>
                    )}
                    <p>{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="glass-effect border-border/20">
          <CardHeader>
            <CardTitle className="text-lg">Статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Всего запусков</span>
              <Badge variant="outline">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Успешных</span>
              <Badge variant="outline" className="text-success border-success/50">10</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">С ошибками</span>
              <Badge variant="outline" className="text-destructive border-destructive/50">2</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Обработано аккаунтов</span>
              <Badge variant="outline">15,420</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileTab;