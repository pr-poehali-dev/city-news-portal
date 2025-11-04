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
    <header className="sticky top-0 z-50 bg-background border-b-4 border-primary">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
          >
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
              ГОРОД<br/>
              <span className="text-accent">ГОВОРИТ</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Icon name="Search" size={24} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = '/admin'}
              title="Админка"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Icon name="Settings" size={24} />
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
          <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide border-t-2 border-border pt-4">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange?.(section)}
                className={`px-4 py-2 text-sm font-black whitespace-nowrap uppercase tracking-wider transition-colors ${
                  activeSection === section
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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