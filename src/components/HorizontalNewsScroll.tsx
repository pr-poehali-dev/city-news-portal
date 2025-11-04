import { useRef } from 'react';
import Icon from '@/components/ui/icon';

interface HorizontalNewsScrollProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  title: string;
}

export const HorizontalNewsScroll = ({ news, onNewsClick, title }: HorizontalNewsScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 800;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (news.length === 0) return null;

  return (
    <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[95vw] mx-auto">
        <div className="flex items-center justify-between mb-12 px-6 lg:px-12">
          <h2 className="text-5xl lg:text-8xl font-black text-black">
            {title}
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Icon name="ChevronLeft" size={28} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Icon name="ChevronRight" size={28} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-6 lg:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {news.map((item) => (
            <article
              key={item.id}
              className="flex-shrink-0 w-[85vw] lg:w-[600px] group cursor-pointer"
              onClick={() => onNewsClick(item.id)}
            >
              <div className="relative overflow-hidden rounded-3xl bg-gray-900 h-[400px]">
                <img
                  src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute top-6 left-6">
                  <span className="inline-block px-4 py-2 bg-white text-black text-xs font-bold rounded-full">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white font-black text-sm md:text-base leading-tight tracking-tighter mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Icon name="Calendar" size={14} />
                    <span>
                      {new Date(item.created_at).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};