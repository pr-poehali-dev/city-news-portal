import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  mainNews: any;
  sideNews: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroSection = ({ mainNews, sideNews, onNewsClick }: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!mainNews) return null;

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  const allNews = [mainNews, ...sideNews.slice(0, 3)];

  return (
    <section className="relative h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 flex">
        <div 
          className="w-full lg:w-2/3 relative cursor-pointer group"
          onClick={() => onNewsClick(allNews[activeIndex].id)}
        >
          <img
            src={allNews[activeIndex].image_url || allNews[activeIndex].image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
            alt={allNews[activeIndex].title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-red-600 text-white text-xs font-bold tracking-[0.3em] uppercase">
                  ГЛАВНОЕ
                </span>
                <span className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase">
                  {allNews[activeIndex].category}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-7xl font-black text-white leading-[0.95] mb-6 tracking-tight">
                {allNews[activeIndex].title}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-300 mb-8 line-clamp-2">
                {stripHtml(allNews[activeIndex].excerpt || allNews[activeIndex].content)}
              </p>

              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <span>{allNews[activeIndex].author_name}</span>
                <span>•</span>
                <span>
                  {new Date(allNews[activeIndex].created_at).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-1/3 bg-black">
          <div className="h-full flex flex-col">
            {allNews.map((news, index) => (
              <div
                key={news.id}
                className={`flex-1 relative cursor-pointer transition-all duration-500 border-b border-gray-800 last:border-0 overflow-hidden group ${
                  activeIndex === index ? 'flex-[2]' : 'flex-1 opacity-60 hover:opacity-100'
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <img
                  src={news.image_url || news.image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                  alt={news.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                />
                
                <div className="relative z-10 h-full p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
                  <span className="text-red-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
                    {news.category}
                  </span>
                  <h3 className={`text-white font-black leading-tight transition-all duration-500 ${
                    activeIndex === index ? 'text-2xl' : 'text-base line-clamp-2'
                  }`}>
                    {news.title}
                  </h3>
                  {activeIndex === index && (
                    <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs">
                      <Icon name="ArrowRight" size={14} />
                      <span>ЧИТАТЬ</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 flex gap-2">
        {allNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex-1 h-1 transition-all ${
              activeIndex === index ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
