import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  mainNews: any;
  sideNews: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroSection = ({ mainNews, sideNews, onNewsClick }: HeroSectionProps) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mainNews) return null;

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  return (
    <section className="relative min-h-[140vh] lg:min-h-[120vh] bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto px-6 lg:px-20 pt-32 lg:pt-48">
        <div className="mb-12 lg:mb-20">
          <div className="overflow-hidden">
            <h1 
              className="text-[20vw] lg:text-[15vw] font-black text-white leading-[0.85] tracking-tighter"
              style={{ transform: `translateX(${scrollY * 0.5}px)` }}
            >
              ГЛАВНОЕ
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 
              className="text-[20vw] lg:text-[15vw] font-black text-white/20 leading-[0.85] tracking-tighter"
              style={{ transform: `translateX(${-scrollY * 0.3}px)` }}
            >
              СЕГОДНЯ
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
          <div 
            className="lg:col-span-7 group cursor-pointer"
            onClick={() => onNewsClick(mainNews.id)}
          >
            <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-3xl bg-white shadow-2xl">
              <img
                src={mainNews.image_url || mainNews.image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                alt={mainNews.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                <div className="inline-block px-4 py-2 bg-white text-black text-xs font-bold mb-4 rounded-full">
                  {mainNews.category}
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  {mainNews.title}
                </h2>
                
                <p className="text-white/80 text-base lg:text-lg mb-6 line-clamp-2">
                  {stripHtml(mainNews.excerpt || mainNews.content)}
                </p>

                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span>{mainNews.author_name}</span>
                  <span>•</span>
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

          <div className="lg:col-span-5 space-y-6">
            {sideNews.slice(0, 2).map((news) => (
              <div
                key={news.id}
                className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-colors duration-300"
                onClick={() => onNewsClick(news.id)}
              >
                <span className="text-white/60 text-xs font-bold mb-3 block">
                  {news.category}
                </span>
                <h3 className="text-white text-xl lg:text-2xl font-bold mb-3 leading-tight">
                  {news.title}
                </h3>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
