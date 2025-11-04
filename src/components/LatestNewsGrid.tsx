import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 8 }: LatestNewsGridProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const displayNews = news.slice(0, limit);

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  return (
    <section className="relative bg-black text-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              ПОСЛЕДНИЕ ПУБЛИКАЦИИ
            </span>
            <h2 className="text-5xl lg:text-7xl font-black">
              Новости
            </h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent ml-12"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {displayNews.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const layout = index % 8;
            
            let colSpan = 'lg:col-span-4';
            let aspect = 'aspect-[4/5]';
            
            if (layout === 0 || layout === 4) {
              colSpan = 'lg:col-span-6';
              aspect = 'aspect-[16/10]';
            } else if (layout === 1 || layout === 5) {
              colSpan = 'lg:col-span-6';
              aspect = 'aspect-[16/10]';
            }
            
            return (
              <article
                key={item.id}
                className={`group relative cursor-pointer ${colSpan} transition-all duration-500 ${
                  isExpanded ? 'scale-105 z-10' : 'scale-100'
                }`}
                onClick={() => onNewsClick(item.id)}
                onMouseEnter={() => setExpandedId(item.id)}
                onMouseLeave={() => setExpandedId(null)}
              >
                <div className={`relative overflow-hidden ${aspect}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent z-10 mix-blend-multiply"></div>
                  
                  <img
                    src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isExpanded ? 'scale-110 brightness-75' : 'scale-100 brightness-100'
                    }`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-[0.3em] uppercase">
                      {item.category}
                    </span>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${
                    isExpanded ? 'translate-y-0' : 'translate-y-2'
                  }`}>
                    <h3 className={`text-white font-black leading-tight mb-3 transition-all duration-300 ${
                      colSpan === 'lg:col-span-6' ? 'text-2xl lg:text-4xl' : 'text-xl lg:text-2xl'
                    }`}>
                      {item.title}
                    </h3>
                    
                    {colSpan === 'lg:col-span-6' && (
                      <p className={`text-gray-300 text-sm lg:text-base mb-4 line-clamp-2 transition-opacity duration-500 ${
                        isExpanded ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {stripHtml(item.excerpt || item.content)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </span>
                      {isExpanded && (
                        <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                          <span>ЧИТАТЬ</span>
                          <Icon name="ArrowRight" size={14} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`absolute inset-0 border-2 border-red-600 transition-opacity duration-500 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
