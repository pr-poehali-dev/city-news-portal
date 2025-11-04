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
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  const bentoLayout = [
    { cols: 'lg:col-span-8', rows: 'lg:row-span-2', aspect: 'aspect-[21/9]' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1', aspect: 'aspect-[16/9]' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1', aspect: 'aspect-[16/9]' },
    { cols: 'lg:col-span-6', rows: 'lg:row-span-1', aspect: 'aspect-[16/9]' },
    { cols: 'lg:col-span-6', rows: 'lg:row-span-1', aspect: 'aspect-[16/9]' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1', aspect: 'aspect-square' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1', aspect: 'aspect-square' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1', aspect: 'aspect-square' },
  ];

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="max-w-[2000px] mx-auto px-6 lg:px-20">
        <div className="mb-16">
          <h2 className="text-7xl lg:text-9xl font-black mb-4">
            Читают
          </h2>
          <h2 className="text-7xl lg:text-9xl font-black text-gray-200">
            сейчас
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr">
          {displayNews.map((item, index) => {
            const layout = bentoLayout[index % bentoLayout.length];
            const isHovered = hoveredId === item.id;
            const isLarge = layout.cols === 'lg:col-span-8';

            return (
              <article
                key={item.id}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl ${layout.cols} ${layout.rows}`}
                onClick={() => onNewsClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative h-full ${layout.aspect} lg:aspect-auto`}>
                  <img
                    src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-90'
                  }`}></div>

                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-4 py-2 bg-white text-black text-xs font-bold rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 ${isLarge ? 'lg:p-12' : ''}`}>
                    <h3 className={`text-white font-black leading-tight mb-3 ${
                      isLarge ? 'text-3xl lg:text-6xl' : 'text-2xl lg:text-3xl'
                    }`}>
                      {item.title}
                    </h3>
                    
                    {isLarge && (
                      <p className={`text-white/80 text-base lg:text-xl mb-4 line-clamp-2 transition-opacity duration-500 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}>
                        {stripHtml(item.excerpt || item.content)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-white/60 text-sm">
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
