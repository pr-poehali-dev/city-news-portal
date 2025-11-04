import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LoginFormProps {
  loginForm: { login: string; password: string };
  loading: boolean;
  onLoginChange: (field: 'login' | 'password', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = ({ loginForm, loading, onLoginChange, onSubmit }: LoginFormProps) => {
  return (
    <div className="min-h-screen bg-accent flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-primary rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-primary border-b-4 border-primary">
          <CardTitle className="text-3xl md:text-4xl font-black text-white uppercase text-center tracking-tight">
            ВХОД
          </CardTitle>
          <p className="text-white/70 text-sm uppercase font-bold tracking-wider text-center mt-2">
            Город говорит
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="ЛОГИН"
                value={loginForm.login}
                onChange={(e) => onLoginChange('login', e.target.value)}
                required
                className="border-2 border-primary rounded-none h-12 text-base font-bold uppercase placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="ПАРОЛЬ"
                value={loginForm.password}
                onChange={(e) => onLoginChange('password', e.target.value)}
                required
                className="border-2 border-primary rounded-none h-12 text-base font-bold uppercase placeholder:text-muted-foreground/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-accent text-white font-black uppercase text-base tracking-wider rounded-none border-4 border-primary transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
              disabled={loading}
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};