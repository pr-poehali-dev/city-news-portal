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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">

      <div className="px-4 lg:px-20 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
          >
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight hover:text-gray-600 transition-colors">
              Город Говорит
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon name="Search" size={20} />
            </button>
            <button
              onClick={() => window.location.href = '/admin'}
              title="Админка"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon name="Settings" size={20} />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mt-4 flex gap-2">
            <Input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
              autoFocus
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim()}
              className="bg-black text-white hover:bg-gray-800"
            >
              Найти
            </Button>
            <button 
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};