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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-center">
            Вход в админ-панель
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Логин"
                value={loginForm.login}
                onChange={(e) => onLoginChange('login', e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={loginForm.password}
                onChange={(e) => onLoginChange('password', e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
