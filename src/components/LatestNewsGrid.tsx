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

  return (
    <section className="bg-white py-12 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 border-l-4 border-orange-600 pl-4">
            Читают сейчас
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayNews.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <article
                key={item.id}
                className="group cursor-pointer"
                onClick={() => onNewsClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-gray-900 font-bold text-lg leading-tight mb-3 line-clamp-3 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        <span>
                          {new Date(item.created_at).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        <span>{item.read_time || '5 мин'}</span>
                      </div>
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
