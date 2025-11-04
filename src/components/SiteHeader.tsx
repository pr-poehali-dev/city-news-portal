import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div 
            className="cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                <Icon name="Newspaper" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
                  Город говорит
                </h1>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Краснодар</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Icon name="Search" size={22} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = '/admin'}
              title="Админка"
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Icon name="Settings" size={22} />
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
        
        {sections.length > 0 && (
          <nav className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange?.(section)}
                className={`px-5 py-2.5 text-sm font-bold whitespace-nowrap rounded-full transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
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