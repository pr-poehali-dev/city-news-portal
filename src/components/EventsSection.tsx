import { useState, useEffect } from 'react';
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

const capitalizeFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const EventsSection = ({ events }: EventsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  if (events.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const currentEvent = events[currentIndex];

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-[#FF4136] px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              АФИША
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-white"></div>
          </div>
          <Icon name="Calendar" size={48} className="text-white/30 flex-shrink-0 md:w-16 md:h-16" />
        </div>
      </div>

      <div className="bg-white border-b-4 border-primary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <a
            href={currentEvent.kudago_url}
            target="_blank"
            rel="noopener noreferrer"
            className="md:col-span-2 group relative overflow-hidden bg-black border-b-4 md:border-b-0 md:border-r-4 border-primary"
          >
            <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
              {currentEvent.image_url ? (
                <img 
                  src={currentEvent.image_url}
                  alt={capitalizeFirst(currentEvent.title)}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-[#FF4136]/20 flex items-center justify-center">
                  <Icon name="Calendar" size={80} className="text-[#FF4136]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              {currentEvent.is_free && (
                <div className="absolute top-3 left-3 md:top-6 md:left-6">
                  <div className="bg-[#2ECC40] px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                      Бесплатно
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-8">
                <h3 className="text-white text-2xl md:text-4xl font-black uppercase leading-tight tracking-tighter mb-3 md:mb-4 group-hover:text-[#FF4136] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)] line-clamp-2">
                  {capitalizeFirst(currentEvent.title)}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  {(currentEvent.event_date || currentEvent.event_date_display) && (
                    <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm font-bold uppercase">
                      <Icon name="Clock" size={16} className="flex-shrink-0" />
                      <span className="truncate">
                        {currentEvent.event_date_display || new Date(currentEvent.event_date!).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {currentEvent.location && (
                    <div className="flex items-center gap-2 text-white/80 text-xs md:text-sm font-bold uppercase">
                      <Icon name="MapPin" size={16} className="flex-shrink-0" />
                      <span className="truncate">{currentEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </a>

          <div className="p-4 md:p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="mb-4 pb-4 border-b-2 border-primary">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Событие</div>
                <div className="text-2xl font-black">{currentIndex + 1}<span className="text-muted-foreground">/{events.length}</span></div>
              </div>

              {currentEvent.age_restriction && (
                <div className="mb-3 inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase border-2 border-primary">
                  {currentEvent.age_restriction}
                </div>
              )}

              {!currentEvent.is_free && currentEvent.price && (
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Цена</div>
                  <div className="text-lg font-black">{currentEvent.price}</div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
                className="flex-1 px-4 py-3 bg-black hover:bg-accent text-white font-black uppercase border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="flex-1 px-4 py-3 bg-black hover:bg-accent text-white font-black uppercase border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
