import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string | null;
  event_date_display?: string | null;
  location: string;
  image_url: string;
  is_free: boolean;
  price: string;
  age_restriction: string;
  kudago_url: string;
}

interface EventsSectionProps {
  events: Event[];
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (events.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 py-12 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-5xl font-black text-white">
            🎭 Афиша города
          </h2>
          
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-orange-600 transition-all"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-orange-600 transition-all"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.slice(0, 12).map((event, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <a
                key={event.id}
                href={event.kudago_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[280px] group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg h-[380px] hover:shadow-2xl transition-all duration-300">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                  {event.is_free && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
                      БЕСПЛАТНО
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-base leading-tight mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 text-white/80 text-xs">
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={14} />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      
                      {event.event_date_display && (
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={14} />
                          <span className="line-clamp-1">{event.event_date_display}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
