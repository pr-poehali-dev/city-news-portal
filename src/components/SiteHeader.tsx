import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface SiteHeaderProps {
  weather?: any;
  sections: string[];
  activeSection?: string;
  onSectionChange: (section: string) => void;
  onSearch?: (query: string) => void;
}

export const SiteHeader = ({ weather, sections, activeSection, onSectionChange, onSearch }: SiteHeaderProps) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-primary/10 dark:border-border/50 shadow-sm dark:shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
          >
            <h1 className="text-4xl font-bold text-primary font-serif">
              Город говорит
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Краснодар</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {weather && (
              <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30 hidden sm:block">
                <CardContent className="p-2 md:p-3 flex items-center gap-2">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                  <div>
                    <div className="text-xl md:text-2xl font-bold">{weather.temp}°C</div>
                    <div className="text-xs text-muted-foreground capitalize">{weather.description}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Icon name="Search" size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/admin'}
              title="Админка"
            >
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="mb-4 flex gap-2">
            <Input
              type="text"
              placeholder="Поиск по новостям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
              <Icon name="Search" size={16} className="mr-2" />
              Найти
            </Button>
            <Button variant="outline" onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}>
              <Icon name="X" size={16} />
            </Button>
          </div>
        )}
        
        <nav className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => onSectionChange(section)}
              className={`text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === section
                  ? 'text-primary dark:text-primary border-b-2 border-primary pb-2'
                  : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};