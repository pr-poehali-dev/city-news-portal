import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  mainNews: any;
  sideNews: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroSection = ({ mainNews, sideNews, onNewsClick }: HeroSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!mainNews) return null;

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  return (
    <section className="relative min-h-screen bg-black">
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-3">
        <div 
          className="relative group cursor-pointer overflow-hidden lg:col-span-2"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <img
            src={mainNews.image_url || mainNews.image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
            alt={mainNews.title}
            className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          
          <div className="absolute top-8 left-8 lg:top-16 lg:left-16 z-10">
            <div className="inline-flex items-center gap-3 bg-red-600 px-5 py-2.5 text-white font-bold text-xs uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Главная новость
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16 z-10">
            <span className="inline-block text-xs text-red-500 font-bold uppercase tracking-widest mb-4">
              {mainNews.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] text-white mb-6 lg:mb-8 tracking-tight">
              {mainNews.title}
            </h1>
            
            <p className="text-lg lg:text-2xl text-gray-300 mb-6 lg:mb-8 max-w-4xl leading-relaxed line-clamp-2 lg:line-clamp-3">
              {stripHtml(mainNews.excerpt || mainNews.content)}
            </p>

            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="User" size={16} />
                <span>{mainNews.author_name}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                <span>
                  {new Date(mainNews.created_at).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col">
          {sideNews.slice(0, 3).map((news, index) => (
            <div
              key={news.id}
              className="relative flex-1 group cursor-pointer overflow-hidden border-b border-black last:border-0"
              onClick={() => onNewsClick(news.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={news.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                alt={news.title}
                className={`w-full h-full object-cover transition-all duration-[1500ms] ${
                  hoveredIndex === index ? 'scale-110 brightness-110' : 'scale-100 brightness-75'
                }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-500 ${
                hoveredIndex === index ? 'opacity-90' : 'opacity-100'
              }`}></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="text-xs text-red-500 font-bold uppercase tracking-widest mb-3">
                  {news.category}
                </span>
                <h3 className={`text-xl font-bold text-white leading-tight transition-all duration-300 ${
                  hoveredIndex === index ? 'text-2xl mb-4' : 'mb-3'
                }`}>
                  {news.title}
                </h3>
                
                <div className={`flex items-center gap-2 text-gray-400 text-xs transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-70'
                }`}>
                  <Icon name="Calendar" size={12} />
                  <span>{new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden relative z-10 pt-[100vh] bg-black">
        <div className="px-6 py-12 space-y-6">
          {sideNews.slice(0, 3).map((news) => (
            <div
              key={news.id}
              className="relative group cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => onNewsClick(news.id)}
            >
              <div className="aspect-[16/9] relative">
                <img
                  src={news.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs text-red-500 font-bold uppercase tracking-widest mb-2 block">
                    {news.category}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {news.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
