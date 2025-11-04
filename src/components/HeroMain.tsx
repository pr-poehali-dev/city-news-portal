import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface HeroMainProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroMain = ({ news, onNewsClick }: HeroMainProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  const mainNews = news[currentIndex];
  const sideNews = news.filter((_, i) => i !== currentIndex).slice(0, 2);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="absolute top-20 right-20 text-[20rem] font-black text-orange-600">☀</div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div 
            className="lg:col-span-2 group cursor-pointer"
            onClick={() => onNewsClick(mainNews.id)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl h-[500px] lg:h-[600px]">
              <img
                src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                alt={mainNews.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg">
                  <Icon name="Flame" size={16} />
                  ГЛАВНОЕ
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded">
                    {mainNews.category}
                  </span>
                </div>
                
                <h1 className="text-white font-black text-3xl lg:text-5xl leading-tight mb-4 hover:text-orange-300 transition-colors">
                  {mainNews.title}
                </h1>

                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} />
                    <span>
                      {new Date(mainNews.created_at).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    <span>{mainNews.read_time || '5 мин'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sideNews.map((item) => (
              <article
                key={item.id}
                className="group cursor-pointer"
                onClick={() => onNewsClick(item.id)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg h-[242px] lg:h-[290px]">
                  <img
                    src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded mb-3">
                      {item.category}
                    </span>
                    
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-orange-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-12 bg-orange-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
