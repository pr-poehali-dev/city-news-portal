import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface SiteHeaderProps {
  sections?: string[];
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onSearch?: (query: string) => void;
}

export const SiteHeader = ({ onSearch }: SiteHeaderProps) => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-200">
      <div className="px-6 lg:px-20 py-6">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight hover:text-gray-600 transition-colors">
              Город Говорит
            </h1>
            <p className="text-sm text-gray-400 font-medium">Краснодар</p>
          </div>

          <div className="flex items-center gap-3">
            {!showSearch && (
              <button
                onClick={() => setShowSearch(true)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Icon name="Search" size={20} />
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/admin'}
              title="Админка"
              className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <Icon name="Settings" size={20} />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mt-6 flex gap-3">
            <Input
              type="text"
              placeholder="Поиск по новостям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 h-12 rounded-2xl border-2 border-gray-200 focus:border-black transition-colors"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="px-6 h-12 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Найти
            </button>
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};