import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 9 }: LatestNewsGridProps) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const displayNews = news.slice(0, limit);

  const stripHtml = (html: string) => {
    if (!html) return '';
    
    let text = html;
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&[a-z]+;/gi, ' ');
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  };

  return (
    <section className="bg-white">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-16 lg:py-24">
        <div className="mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-4">
            Актуальное
          </h2>
          <div className="w-20 h-1 bg-black"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayNews.map((item, index) => {
            const isLarge = index % 5 === 0;
            const isHovered = hoveredId === item.id;
            
            return (
              <article
                key={item.id}
                className={`group relative cursor-pointer overflow-hidden ${
                  isLarge ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => onNewsClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden ${
                  isLarge ? 'aspect-[16/10]' : 'aspect-[4/5]'
                }`}>
                  <img
                    src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-[1500ms] ${
                      isHovered ? 'scale-110 brightness-90' : 'scale-100 brightness-100'
                    }`}
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-80'
                  }`}></div>

                  <div className="absolute top-6 left-6 z-10">
                    <span className={`inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isHovered ? 'bg-red-600 backdrop-blur-none' : ''
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 transition-all duration-500 ${
                    isLarge ? 'lg:p-12' : ''
                  } ${
                    isHovered ? 'translate-y-0' : 'translate-y-2'
                  }`}>
                    <h3 className={`text-white font-black leading-tight mb-4 transition-all duration-300 ${
                      isLarge ? 'text-2xl lg:text-4xl' : 'text-xl lg:text-2xl'
                    }`}>
                      {item.title}
                    </h3>
                    
                    {isLarge && (
                      <p className={`text-gray-300 text-base lg:text-lg mb-6 leading-relaxed line-clamp-2 transition-opacity duration-500 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {stripHtml(item.excerpt || item.content)}
                      </p>
                    )}
                    
                    <div className={`flex items-center gap-3 text-gray-400 text-sm transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-70'
                    }`}>
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};