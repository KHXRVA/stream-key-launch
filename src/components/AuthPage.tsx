import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap } from "lucide-react";

interface AuthPageProps {
  onAuth: () => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    
    setIsLoading(true);
    // Simulate auth check
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/5 animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/5 animate-float" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/3 to-accent/3 animate-pulse" />
      </div>

      <Card className="w-full max-w-md glass-effect border-border/20 shadow-elevation relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text mb-2">
            StreamUp
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Введите ключ доступа для продолжения
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Введите ключ доступа"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="pl-12 h-12 bg-muted/30 border-border/50 focus:border-primary/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold transition-all duration-300 hover:shadow-glow-primary"
              disabled={isLoading || !key.trim()}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Проверка...</span>
                </div>
              ) : (
                "Войти"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Для получения доступа обратитесь к администратору
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;