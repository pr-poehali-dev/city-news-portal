import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface SiteHeaderProps {
  sections?: string[];
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onSearch?: (query: string) => void;
}

export const SiteHeader = ({ sections = [], activeSection, onSectionChange, onSearch }: SiteHeaderProps) => {
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
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-accent">
      <div className="bg-gradient-to-r from-accent via-orange-500 to-yellow-500 py-2">
        <div className="container mx-auto px-6 flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            <Icon name="Sun" size={16} className="animate-pulse" />
            <span className="font-semibold">Краснодар • Южная столица</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Icon name="CloudSun" size={14} />
            <span>+25°C</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div 
            className="cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
          >
            <div className="relative">
              <h1 className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-primary via-accent to-orange-500 bg-clip-text text-transparent tracking-tight">
                Город Говорит
              </h1>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-2xl hover:bg-primary/10 hover:scale-110 transition-all duration-300"
            >
              <Icon name="Search" size={20} className="text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = '/admin'}
              title="Админка"
              className="rounded-2xl hover:bg-accent/10 hover:scale-110 transition-all duration-300"
            >
              <Icon name="Settings" size={20} className="text-accent" />
            </Button>
          </div>
        </div>

        {showSearch && (
          <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Input
              type="text"
              placeholder="Поиск по новостям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 rounded-3xl border-2 border-primary/20 focus:border-primary transition-colors"
              autoFocus
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim()}
              className="rounded-3xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              <Icon name="Search" size={16} className="mr-2" />
              Найти
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="rounded-3xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        )}
        
        {sections.length > 0 && (
          <nav className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange?.(section)}
                className={`px-6 py-3 text-sm font-bold whitespace-nowrap rounded-3xl transition-all duration-300 border-2 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 border-transparent scale-105'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:scale-105 hover:shadow-md'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
