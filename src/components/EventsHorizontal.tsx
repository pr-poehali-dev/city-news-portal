import { useRef } from 'react';
import Icon from '@/components/ui/icon';

interface EventsHorizontalProps {
  events: any[];
}

export const EventsHorizontal = ({ events }: EventsHorizontalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (events.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-[95vw] mx-auto">
        <div className="flex items-center justify-between mb-12 px-6 lg:px-12">
          <div>
            <h2 className="text-5xl lg:text-8xl font-black text-white">
              Куда пойти
            </h2>
            <p className="text-white/70 text-xl lg:text-2xl mt-2 font-bold">
              Афиша города
            </p>
          </div>
          
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-purple-600 transition-all"
            >
              <Icon name="ChevronLeft" size={28} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-purple-600 transition-all"
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
          {events.slice(0, 12).map((event) => (
            <a
              key={event.id}
              href={event.kudago_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[75vw] lg:w-[400px] group"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl h-[500px] group-hover:scale-105 transition-transform duration-500">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                {event.is_free && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-full">
                    БЕСПЛАТНО
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-black text-xl lg:text-2xl leading-tight mb-4">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    
                    {event.event_date_display && (
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={16} />
                        <span>{event.event_date_display}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
