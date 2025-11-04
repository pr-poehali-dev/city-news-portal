import { useState } from 'react';
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (events.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto px-6 lg:px-20">
        <div className="mb-16">
          <h2 className="text-7xl lg:text-9xl font-black text-white mb-4">
            Куда
          </h2>
          <h2 className="text-7xl lg:text-9xl font-black text-white/20">
            пойти
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 6).map((event, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <a
                key={event.id}
                href={event.kudago_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`group relative transition-all duration-500 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-2xl">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${
                      isHovered ? 'opacity-95' : 'opacity-85'
                    }`}></div>

                    {event.is_free && (
                      <div className="absolute top-6 right-6 px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-full">
                        БЕСПЛАТНО
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className={`text-white font-black leading-tight mb-6 transition-all duration-300 ${
                        isHovered ? 'text-3xl' : 'text-2xl'
                      }`}>
                        {event.title}
                      </h3>

                      <div className={`space-y-3 text-white/80 text-sm transition-opacity duration-500 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Icon name="MapPin" size={16} />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        
                        {event.event_date_display && (
                          <div className="flex items-center gap-3">
                            <Icon name="Clock" size={16} />
                            <span>{event.event_date_display}</span>
                          </div>
                        )}
                        
                        {!event.is_free && event.price && (
                          <div className="flex items-center gap-3">
                            <Icon name="Ticket" size={16} />
                            <span>{event.price}</span>
                          </div>
                        )}
                      </div>
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
