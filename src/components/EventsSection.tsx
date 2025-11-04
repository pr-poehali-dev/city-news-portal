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
  const [currentIndex, setCurrentIndex] = useState(0);

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          key={currentEvent.id}
          src={currentEvent.image_url}
          alt={currentEvent.title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="px-6 lg:px-20 py-12 lg:py-16">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-2">
            Афиша
          </h2>
          <div className="w-20 h-1 bg-white"></div>
        </div>

        <div className="flex-1 flex items-end pb-12 lg:pb-20">
          <div className="w-full px-6 lg:px-20">
            <div className="max-w-5xl">
              {currentEvent.is_free && (
                <div className="inline-flex items-center gap-2 bg-green-500 text-black px-6 py-3 font-black text-sm uppercase tracking-wider mb-6">
                  <Icon name="Ticket" size={16} />
                  Бесплатно
                </div>
              )}

              <a
                href={currentEvent.kudago_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 lg:mb-12 group-hover:text-gray-300 transition-colors">
                  {currentEvent.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10 lg:mb-16">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                      <Icon name="MapPin" size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Место</div>
                      <div className="text-lg lg:text-xl text-white font-medium">
                        {currentEvent.location}
                      </div>
                    </div>
                  </div>

                  {currentEvent.event_date_display && (
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                        <Icon name="Clock" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Дата</div>
                        <div className="text-lg lg:text-xl text-white font-medium">
                          {currentEvent.event_date_display}
                        </div>
                      </div>
                    </div>
                  )}

                  {!currentEvent.is_free && currentEvent.price && (
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                        <Icon name="Ticket" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Цена</div>
                        <div className="text-lg lg:text-xl text-white font-medium">
                          {currentEvent.price}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                      <Icon name="Info" size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Возраст</div>
                      <div className="text-lg lg:text-xl text-white font-medium">
                        {currentEvent.age_restriction}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-wider group-hover:bg-gray-200 transition-colors">
                  Подробнее
                  <Icon name="ArrowRight" size={20} />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-20 pb-12 lg:pb-16">
          <div className="flex items-center gap-6">
            <button
              onClick={handlePrev}
              className="w-14 h-14 rounded-full border-2 border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center backdrop-blur-md"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>

            <div className="flex gap-3">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all ${
                    index === currentIndex
                      ? 'w-12 h-2 bg-white'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-full border-2 border-white/20 hover:bg-white hover:text-black transition-all flex items-center justify-center backdrop-blur-md"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
