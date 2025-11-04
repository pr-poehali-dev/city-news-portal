import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';

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
  const [currentIndex, setCurrentIndex] = useState(0);

  if (events.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const visibleEvents = [
    events[(currentIndex - 1 + events.length) % events.length],
    events[currentIndex],
    events[(currentIndex + 1) % events.length],
  ];

  return (
    <section className="py-32 px-6 lg:px-20 bg-black text-white overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Icon name="Calendar" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-6xl lg:text-8xl font-black tracking-tight">
                Афиша
              </h2>
              <p className="text-gray-400 text-xl font-light mt-2">
                Куда пойти в Краснодаре
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-8 mb-12">
            <button
              onClick={handlePrev}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>

            <div className="flex items-center gap-6 overflow-hidden">
              {visibleEvents.map((event, idx) => {
                const isActive = idx === 1;
                return (
                  <div
                    key={event.id}
                    className={`transition-all duration-500 ${
                      isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-30'
                    }`}
                    style={{ width: isActive ? '600px' : '400px' }}
                  >
                    <MagneticCard>
                      <a
                        href={event.kudago_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="bg-zinc-900 rounded-3xl overflow-hidden">
                          <div className="relative h-96">
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
                            
                            {event.is_free && (
                              <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                                Бесплатно
                              </div>
                            )}
                          </div>
                          
                          <div className="p-8">
                            <h3 className="text-2xl font-bold mb-4 line-clamp-2">
                              {event.title}
                            </h3>
                            
                            <div className="space-y-3 text-gray-400 mb-6">
                              <div className="flex items-center gap-2">
                                <Icon name="MapPin" size={16} />
                                <span className="text-sm">{event.location}</span>
                              </div>
                              {event.event_date_display && (
                                <div className="flex items-center gap-2">
                                  <Icon name="Clock" size={16} />
                                  <span className="text-sm">{event.event_date_display}</span>
                                </div>
                              )}
                              {!event.is_free && event.price && (
                                <div className="flex items-center gap-2">
                                  <Icon name="Ticket" size={16} />
                                  <span className="text-sm">{event.price}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{event.age_restriction}</span>
                              <div className="flex items-center gap-2 text-cyan-400">
                                <span className="font-semibold">Подробнее</span>
                                <Icon name="ArrowRight" size={20} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </MagneticCard>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </div>

          <div className="flex justify-center gap-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-cyan-500 w-8' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
