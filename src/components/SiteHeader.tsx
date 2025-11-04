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
    <header className="sticky top-0 z-50 bg-white border-b-4 border-primary shadow-[0_4px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="border-b-4 border-primary bg-accent">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div 
              className="cursor-pointer group" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate('/');
              }}
            >
              <div className="flex items-baseline gap-2 md:gap-3">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter group-hover:scale-105 transition-transform">
                  ГОРОД
                </h1>
                <div className="bg-white px-2 py-1 md:px-4 md:py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-lg md:text-2xl lg:text-4xl font-black text-accent uppercase tracking-tighter">
                    ГОВОРИТ
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="hover:bg-white hover:text-accent transition-all w-12 h-12 rounded-none border-2 border-white hover:scale-110"
              >
                <Icon name="Search" size={24} className="text-white hover:text-accent" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.location.href = '/admin'}
                title="Админка"
                className="hover:bg-white hover:text-accent transition-all w-12 h-12 rounded-none border-2 border-white hover:scale-110"
              >
                <Icon name="Settings" size={24} className="text-white hover:text-accent" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="container mx-auto px-6 py-4 bg-black border-b-4 border-primary">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="ПОИСК ПО НОВОСТЯМ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 text-lg font-bold uppercase border-4 border-white bg-black text-white placeholder:text-white/50 focus:border-accent rounded-none"
              autoFocus
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim()}
              className="bg-accent hover:bg-accent/90 text-white font-black uppercase px-8 rounded-none border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-all"
            >
              <Icon name="Search" size={20} className="mr-2" />
              Найти
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="bg-white hover:bg-black hover:text-white border-4 border-white font-black rounded-none"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      )}
      
      {sections.length > 0 && (
        <nav className="container mx-auto px-0 md:px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange?.(section)}
                className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-black whitespace-nowrap uppercase tracking-wider transition-all border-r-2 border-primary last:border-r-0 flex-shrink-0 ${
                  activeSection === section
                    ? 'bg-accent text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};