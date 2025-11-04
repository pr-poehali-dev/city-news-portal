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
    <section className="relative bg-white py-20 lg:py-32">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-red-600 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              КУД А ПОЙТИ
            </span>
            <h2 className="text-5xl lg:text-7xl font-black">
              Афиша
            </h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-12"></div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event, index) => {
              const isHovered = hoveredIndex === index;
              const rotation = index % 3 === 0 ? '-2deg' : index % 3 === 1 ? '1deg' : '-1deg';
              
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
                  <div 
                    className={`group relative transition-all duration-500 ${
                      isHovered ? 'scale-105 z-10' : 'scale-100'
                    }`}
                    style={{
                      transform: isHovered ? 'rotate(0deg) translateY(-10px)' : `rotate(${rotation}) translateY(0px)`
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-2xl">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isHovered ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      
                      <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-500 ${
                        isHovered ? 'opacity-90' : 'opacity-70'
                      }`}></div>

                      {event.is_free && (
                        <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-black text-xs font-bold tracking-wider z-10">
                          БЕСПЛАТНО
                        </div>
                      )}

                      <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${
                        isHovered ? 'translate-y-0' : 'translate-y-4'
                      }`}>
                        <h3 className={`text-white font-black leading-tight mb-4 transition-all duration-300 ${
                          isHovered ? 'text-2xl' : 'text-xl'
                        }`}>
                          {event.title}
                        </h3>

                        <div className={`space-y-2 text-sm text-gray-300 transition-opacity duration-500 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" size={14} />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          
                          {event.event_date_display && (
                            <div className="flex items-center gap-2">
                              <Icon name="Clock" size={14} />
                              <span>{event.event_date_display}</span>
                            </div>
                          )}
                          
                          {!event.is_free && event.price && (
                            <div className="flex items-center gap-2">
                              <Icon name="Ticket" size={14} />
                              <span>{event.price}</span>
                            </div>
                          )}
                        </div>

                        {isHovered && (
                          <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold">
                            <span>ПОДРОБНЕЕ</span>
                            <Icon name="ArrowRight" size={14} />
                          </div>
                        )}
                      </div>

                      <div className={`absolute inset-0 border-4 border-red-600 transition-opacity duration-500 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}></div>
                    </div>

                    <div className={`absolute -bottom-2 -right-2 w-full h-full bg-black -z-10 transition-all duration-500 ${
                      isHovered ? 'opacity-30' : 'opacity-10'
                    }`}></div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
