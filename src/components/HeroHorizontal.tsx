import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface HeroHorizontalProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroHorizontal = ({ news, onNewsClick }: HeroHorizontalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (news.length === 0) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <img
          src={currentNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
          alt={currentNews.title}
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-[90vw] ml-[5vw] lg:ml-[10vw]">
          <div 
            className={`space-y-6 lg:space-y-8 transition-all duration-700 ${
              isTransitioning ? 'opacity-0 translate-x-[-100px]' : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="inline-block px-6 py-3 bg-red-600 text-white text-sm lg:text-base font-black rounded-full">
              {currentNews.category}
            </div>

            <h1 
              className="text-white font-black leading-[0.9] cursor-pointer hover:text-red-500 transition-colors"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 10rem)' }}
              onClick={() => onNewsClick(currentNews.id)}
            >
              {currentNews.title}
            </h1>

            <div className="flex items-center gap-4 lg:gap-6 text-white/60">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={18} />
                <span className="text-sm lg:text-base">
                  {new Date(currentNews.created_at).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={18} />
                <span className="text-sm lg:text-base">{currentNews.read_time || '5 мин'}</span>
              </div>
            </div>

            <button
              onClick={() => onNewsClick(currentNews.id)}
              className="group flex items-center gap-4 px-8 py-4 bg-white text-black font-black text-lg rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              ЧИТАТЬ
              <Icon name="ArrowRight" size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-[5vw] lg:left-[10vw] z-20 flex gap-3">
        {news.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-16 bg-white' 
                : 'w-8 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
