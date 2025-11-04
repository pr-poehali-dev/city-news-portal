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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
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
              <div className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
              <h1 className="relative text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-accent via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                Город Говорит
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-2xl hover:bg-gradient-to-br hover:from-accent/10 hover:to-purple-500/10 hover:scale-110 transition-all duration-300"
            >
              <Icon name="Search" size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = '/admin'}
              title="Админка"
              className="rounded-2xl hover:bg-gradient-to-br hover:from-accent/10 hover:to-purple-500/10 hover:scale-110 transition-all duration-300"
            >
              <Icon name="Settings" size={20} />
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
              className="flex-1 rounded-2xl border-2 border-gray-200 focus:border-accent transition-colors"
              autoFocus
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim()}
              className="rounded-2xl bg-gradient-to-r from-accent to-purple-600 hover:shadow-lg hover:shadow-accent/50 transition-all duration-300"
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
              className="rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        )}
        
        {sections.length > 0 && (
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange?.(section)}
                className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap rounded-full transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-lg shadow-accent/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
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