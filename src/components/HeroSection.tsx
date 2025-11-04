import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        {(mainNews.image_url || mainNews.image) ? (
          <img
            src={mainNews.image_url || mainNews.image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
      </div>

      <div className="relative z-10 px-6 lg:px-20 py-32 w-full max-w-[1800px] mx-auto">
        <div 
          className="mb-12"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <div className="inline-flex items-center gap-3 bg-red-600 px-6 py-3 rounded-full mb-8">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Сейчас читают
            </span>
          </div>

          <h1 
            className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.9] mb-8 tracking-tight cursor-pointer group"
            onClick={() => onNewsClick(mainNews.id)}
          >
            {mainNews.title.split(' ').map((word: string, i: number) => (
              <span 
                key={i}
                className="inline-block transition-all duration-300 hover:text-red-500 hover:scale-110 mr-4"
                style={{ 
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p className="text-white/70 text-xl lg:text-3xl font-light max-w-4xl mb-12 leading-relaxed">
            {stripHtml(mainNews.excerpt || mainNews.content).slice(0, 200)}...
          </p>

          <div className="flex items-center gap-8 text-white/60">
            <div className="flex items-center gap-3">
              <Icon name="User" size={20} />
              <span className="text-lg">{mainNews.author_name}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40"></div>
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={20} />
              <span className="text-lg">
                {new Date(mainNews.created_at).toLocaleDateString('ru-RU', { 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {sideNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sideNews.slice(0, 3).map((news, index) => (
              <MagneticCard
                key={news.id}
                onClick={() => onNewsClick(news.id)}
                className="cursor-pointer"
              >
                <div 
                  className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={news.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                  </div>
                  
                  <div className="p-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4 block">
                      {news.category}
                    </span>
                    
                    <h3 className="text-white text-2xl font-bold leading-tight mb-4 line-clamp-2">
                      {news.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-white/40 text-sm">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            ))}
          </div>
        )}

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={48} className="text-white/40" />
        </div>
      </div>
    </section>
  );
};