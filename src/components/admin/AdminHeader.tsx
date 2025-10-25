import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { NotificationSubscribe } from '@/components/NotificationSubscribe';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-primary font-serif truncate">
              Админ-панель
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground truncate">Город говорит</p>
          </div>
          <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
            <NotificationSubscribe compact />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="hidden sm:flex"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              На сайт
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.location.href = '/'}
              className="sm:hidden"
            >
              <Icon name="Home" size={16} />
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onLogout}
              className="hidden sm:flex"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={onLogout}
              className="sm:hidden"
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};