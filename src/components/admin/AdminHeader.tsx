import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';


interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-primary border-b-4 border-primary sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight truncate">
              АДМИНКА
            </h1>
            <p className="text-xs md:text-sm text-white/70 font-bold uppercase tracking-wider mt-1">Город говорит</p>
          </div>
          <div className="flex gap-2 md:gap-3 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="hidden sm:flex bg-white text-black border-2 border-white hover:bg-accent hover:text-white hover:border-accent font-black uppercase rounded-none"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Сайт
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.location.href = '/'}
              className="sm:hidden bg-white text-black border-2 border-white hover:bg-accent hover:text-white rounded-none"
            >
              <Icon name="Home" size={16} />
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onLogout}
              className="hidden sm:flex bg-accent hover:bg-accent/90 border-2 border-white font-black uppercase rounded-none"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={onLogout}
              className="sm:hidden bg-accent hover:bg-accent/90 border-2 border-white rounded-none"
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};