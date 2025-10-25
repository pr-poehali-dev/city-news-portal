import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  if (events.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const currentEvent = events[currentIndex];

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-background dark:from-orange-950/20 dark:via-amber-950/10 dark:to-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30 max-w-32" />
          <Icon name="Ticket" size={28} className="text-primary" />
          <h2 className="text-3xl font-bold text-center">Афиша Краснодара</h2>
          <Icon name="Ticket" size={28} className="text-primary" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/30 max-w-32" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-12">
          <Badge variant="outline" className="gap-1 border-primary/30">
            <Icon name="Sparkles" size={12} />
            KudaGo
          </Badge>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">Лучшие события города</span>
        </div>

        <div className="relative max-w-4xl mx-auto mb-12">
          <a
            href={currentEvent.kudago_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div 
              className="relative rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 overflow-visible"
              style={{
                transform: 'perspective(1000px) rotateY(-1deg)',
                transition: 'all 0.5s ease'
              }}
            >
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-background rounded-full -ml-2.5 z-20"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)'
                }}
              />
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-background rounded-full -mr-2.5 z-20"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)'
                }}
              />

              <div 
                className="flex flex-col md:flex-row min-h-[220px] rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #fefdfb 0%, #fef9f3 50%, #fef5eb 100%)',
                  backgroundImage: `
                    linear-gradient(135deg, #fefdfb 0%, #fef9f3 50%, #fef5eb 100%),
                    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251, 191, 36, 0.015) 2px, rgba(251, 191, 36, 0.015) 4px),
                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(251, 191, 36, 0.015) 2px, rgba(251, 191, 36, 0.015) 4px)
                  `,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
                }}
              >
                {currentEvent.image_url && (
                  <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img 
                      src={currentEvent.image_url}
                      alt={capitalizeFirst(currentEvent.title)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    
                    {currentEvent.is_free && (
                      <div className="absolute top-3 left-3 rotate-12">
                        <Badge className="bg-green-600 text-white border-0 px-2 py-1 text-[10px] font-bold shadow-lg">
                          БЕСПЛАТНО
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded px-2 py-1 inline-block">
                        <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Событие</div>
                        <div className="text-lg font-bold text-primary">{currentIndex + 1}<span className="text-xs text-muted-foreground">/{events.length}</span></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-5 flex flex-col justify-center relative flex-1">
                  <div className="absolute top-4 right-4 text-[10px] text-primary/30 uppercase tracking-widest font-mono">
                    TICKET-{currentEvent.id}
                  </div>
                  
                  <div className="mb-4">
                    <div className="inline-block mb-1.5 px-1.5 py-0.5 bg-primary/5 border border-primary/20 rounded text-[9px] text-primary uppercase tracking-wider font-bold">
                      Краснодар
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1.5 leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {capitalizeFirst(currentEvent.title)}
                    </h3>
                    
                    {currentEvent.description && (
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-1">
                        {currentEvent.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 mb-3 p-3 bg-primary/[0.02] rounded-md border border-primary/10">
                    {(currentEvent.event_date || currentEvent.event_date_display) && (
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded bg-white/80 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm">
                          <Icon name="Clock" size={14} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[9px] text-primary/60 uppercase tracking-widest mb-0.5 font-bold">Когда</div>
                          <div className="text-xs font-semibold text-foreground">
                            {currentEvent.event_date_display || new Date(currentEvent.event_date!).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {currentEvent.location && (
                      <div className="flex items-start gap-2 pt-1.5 border-t border-primary/10">
                        <div className="w-7 h-7 rounded bg-white/80 flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm">
                          <Icon name="MapPin" size={14} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[9px] text-primary/60 uppercase tracking-widest mb-0.5 font-bold">Где</div>
                          <div className="text-xs font-semibold text-foreground line-clamp-1">{currentEvent.location}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between pt-2 border-t-2 border-dashed border-primary/20 gap-2">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {currentEvent.price && !currentEvent.is_free && (
                          <div className="px-2 py-0.5 bg-white/60 border border-primary/30 rounded text-[10px] font-bold text-primary shadow-sm">
                            {currentEvent.price}
                          </div>
                        )}
                        {currentEvent.age_restriction && (
                          <div className="px-1.5 py-0.5 bg-white/60 border border-primary/20 rounded text-[10px] font-semibold text-muted-foreground">
                            {currentEvent.age_restriction}+
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-primary group-hover:gap-1.5 transition-all">
                        <span>Подробнее</span>
                        <Icon name="ExternalLink" size={10} className="opacity-60" />
                      </div>
                    </div>

                    {currentEvent.image_url && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden shadow-xl border-3 border-white/80 dark:border-gray-800/80 rotate-2 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                        <img 
                          src={currentEvent.image_url}
                          alt={capitalizeFirst(currentEvent.title)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 rounded-full shadow-lg bg-card hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all"
            onClick={handlePrev}
          >
            <Icon name="ChevronLeft" size={24} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 rounded-full shadow-lg bg-card hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all"
            onClick={handleNext}
          >
            <Icon name="ChevronRight" size={24} />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {events.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Перейти к событию ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://krd.kudago.com/events/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              <Icon name="Calendar" size={18} />
              Все события на KudaGo
              <Icon name="ExternalLink" size={14} />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};