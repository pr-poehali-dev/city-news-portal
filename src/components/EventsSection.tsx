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
    <section className="bg-black text-white">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="mb-16 lg:mb-24">
          <h2 className="text-5xl lg:text-8xl font-black tracking-tight mb-4">
            Афиша
          </h2>
          <div className="w-24 h-1 bg-white"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7">
            <a
              href={currentEvent.kudago_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden mb-8">
                <img
                  src={currentEvent.image_url}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {currentEvent.is_free && (
                  <div className="absolute top-6 right-6 bg-green-500 text-black px-6 py-2 font-black text-sm tracking-wider">
                    БЕСПЛАТНО
                  </div>
                )}
              </div>
            </a>

            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handlePrev}
                className="w-12 h-12 border border-white/20 hover:bg-white hover:text-black transition-colors flex items-center justify-center"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              
              <div className="flex-1 h-px bg-white/10"></div>
              
              <span className="text-sm font-mono text-gray-500">
                {String(currentIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
              </span>
              
              <div className="flex-1 h-px bg-white/10"></div>

              <button
                onClick={handleNext}
                className="w-12 h-12 border border-white/20 hover:bg-white hover:text-black transition-colors flex items-center justify-center"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <a
              href={currentEvent.kudago_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <h3 className="text-3xl lg:text-5xl font-black leading-tight mb-8 lg:mb-12 group-hover:text-gray-300 transition-colors">
                {currentEvent.title}
              </h3>

              <div className="space-y-6 lg:space-y-8 mb-12">
                <div className="flex gap-4">
                  <Icon name="MapPin" size={24} className="flex-shrink-0 text-gray-500" />
                  <span className="text-lg lg:text-xl text-gray-300">
                    {currentEvent.location}
                  </span>
                </div>

                {currentEvent.event_date_display && (
                  <div className="flex gap-4">
                    <Icon name="Clock" size={24} className="flex-shrink-0 text-gray-500" />
                    <span className="text-lg lg:text-xl text-gray-300">
                      {currentEvent.event_date_display}
                    </span>
                  </div>
                )}

                {!currentEvent.is_free && currentEvent.price && (
                  <div className="flex gap-4">
                    <Icon name="Ticket" size={24} className="flex-shrink-0 text-gray-500" />
                    <span className="text-lg lg:text-xl text-gray-300">
                      {currentEvent.price}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <span className="text-sm font-mono text-gray-500">
                  {currentEvent.age_restriction}
                </span>
                <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                  <span className="font-black tracking-wider">ПОДРОБНЕЕ</span>
                  <Icon name="ArrowRight" size={20} />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
