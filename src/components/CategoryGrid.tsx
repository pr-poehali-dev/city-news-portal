import Icon from '@/components/ui/icon';
import { useEffect, useRef } from 'react';

interface CategoryGridProps {
  categories: string[];
  articles: any[];
  onNewsClick: (newsId: number) => void;
  onCategoryClick: (category: string) => void;
}

export const CategoryGrid = ({ categories, articles, onNewsClick, onCategoryClick }: CategoryGridProps) => {
  const getCategoryNews = (category: string) => {
    return articles.filter(a => a.category === category).slice(0, 4);
  };

  const categoryIcons: { [key: string]: string } = {
    'Политика': 'Landmark',
    'Экономика': 'TrendingUp',
    'Культура': 'Palette',
    'Спорт': 'Trophy',
    'События': 'Zap',
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="py-20 px-4 lg:px-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
            Рубрики
          </h2>
          <p className="text-gray-500 text-lg">
            Листайте горизонтально →
          </p>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide cursor-grab select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category) => {
            const categoryNews = getCategoryNews(category);
            
            if (categoryNews.length === 0) return null;

            return (
              <div 
                key={category}
                className="flex-none w-[85vw] lg:w-[500px] snap-start"
              >
                <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                        <Icon name={categoryIcons[category] || 'Sparkles'} size={24} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        {category}
                      </h3>
                    </div>
                    <button
                      onClick={() => onCategoryClick(category)}
                      className="text-sm font-semibold text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                    >
                      Все
                      <Icon name="ArrowRight" size={16} />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {categoryNews.map((item) => (
                      <div
                        key={item.id}
                        className="group cursor-pointer pb-5 border-b border-gray-100 last:border-0 last:pb-0"
                        onClick={() => onNewsClick(item.id)}
                      >
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base leading-tight mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          {item.image_url && (
                            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
