import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

interface MemoryArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  year: number;
  decade?: string;
  event_date?: string;
  image_url: string;
  is_published: boolean;
}

interface MemorySectionProps {
  memoryArticles: MemoryArticle[];
}

export function MemorySection({ memoryArticles }: MemorySectionProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (memoryArticles.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 border-l-4 border-amber-600 pl-4">
            📜 Город помнит
          </h2>
          
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full hover:bg-amber-600 hover:text-white transition-all shadow-md"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full hover:bg-amber-600 hover:text-white transition-all shadow-md"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
            <button
              onClick={() => navigate('/memory')}
              className="ml-2 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-full hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              ВСЕ ИСТОРИИ
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {memoryArticles.slice(0, 12).map((article) => (
            <article
              key={article.id}
              className="flex-shrink-0 w-[280px] group cursor-pointer"
              onClick={() => navigate(`/memory/${article.id}`)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-2 border-amber-200">
                {article.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 sepia-[0.3]"
                    />
                    
                    <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 rounded font-bold text-sm">
                      {article.year}
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="text-gray-900 font-bold text-base leading-tight mb-2 line-clamp-3 group-hover:text-amber-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Icon name="Calendar" size={14} />
                    <span>
                      {article.event_date 
                        ? new Date(article.event_date).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })
                        : `${article.year} год`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={() => navigate('/memory')}
          className="lg:hidden mt-6 w-full px-4 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
        >
          ВСЕ ИСТОРИИ
          <Icon name="ArrowRight" size={20} />
        </button>
      </div>
    </section>
  );
}
