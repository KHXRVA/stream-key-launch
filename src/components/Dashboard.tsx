import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  LogOut,
  TrendingUp,
  MessageCircle,
  Settings
} from "lucide-react";
import MainTab from "./MainTab";
import ChatTab from "./ChatTab";
import ProfileTab from "./ProfileTab";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [loadedAccounts, setLoadedAccounts] = useState(0);
  const [loadedProxies, setLoadedProxies] = useState(0);

  const handleLoadAccounts = () => {
    const count = Math.floor(Math.random() * 1000) + 100;
    setLoadedAccounts(count);
  };

  const handleLoadProxies = () => {
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

      {/* Tabs */}
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-effect border-border/20">
          <TabsTrigger value="main" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Главная</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Чат</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Личный кабинет</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-6">
          <MainTab 
            loadedAccounts={loadedAccounts}
            loadedProxies={loadedProxies}
            onLoadAccounts={handleLoadAccounts}
            onLoadProxies={handleLoadProxies}
          />
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-6">
          <ChatTab 
            loadedAccounts={loadedAccounts}
            loadedProxies={loadedProxies}
          />
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab onLogout={onLogout} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;