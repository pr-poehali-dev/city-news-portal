import { useState } from 'react';
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
            <div className="relative bg-gradient-to-br from-white to-orange-50/50 dark:from-card dark:to-orange-950/10 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-primary/20 group-hover:border-primary/40">
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full -ml-4 border-2 border-primary/20"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full -mr-4 border-2 border-primary/20"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              
              <div 
                className="absolute left-0 top-0 bottom-0 w-px bg-primary/20"
                style={{
                  marginLeft: '140px',
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, hsl(var(--primary) / 0.3) 8px, hsl(var(--primary) / 0.3) 12px)'
                }}
              />

              <div className="grid md:grid-cols-[140px_1fr] min-h-[280px]">
                <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col items-center justify-center border-r border-primary/10">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20">
                      <Icon name="Calendar" size={28} className="text-primary" />
                    </div>
                    
                    {currentEvent.is_free && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-sm opacity-50" />
                        <Badge className="relative bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 text-xs font-bold">
                          FREE
                        </Badge>
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">
                        Событие
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {currentIndex + 1}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        из {events.length}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-primary/5 to-transparent" />
                </div>
                
                <div className="p-8 flex flex-col justify-center relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0" />
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-3 leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {capitalizeFirst(currentEvent.title)}
                    </h3>
                    
                    {currentEvent.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {currentEvent.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {(currentEvent.event_date || currentEvent.event_date_display) && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="Clock" size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Когда</div>
                          <div className="text-sm font-medium">
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="MapPin" size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Где</div>
                          <div className="text-sm font-medium line-clamp-1">{currentEvent.location}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {currentEvent.price && !currentEvent.is_free && (
                        <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                          <Icon name="Ticket" size={12} />
                          {currentEvent.price}
                        </Badge>
                      )}
                      {currentEvent.age_restriction && (
                        <Badge variant="outline" className="gap-1 border-primary/30">
                          {currentEvent.age_restriction}+
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary pt-2 border-t border-primary/10">
                    <span>Подробности на KudaGo</span>
                    <Icon name="ExternalLink" size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {currentEvent.image_url && (
                <div className="absolute top-4 right-4 w-20 h-20 rounded-lg overflow-hidden shadow-lg border-2 border-white dark:border-gray-800 opacity-90 group-hover:opacity-100 transition-opacity">
                  <img 
                    src={currentEvent.image_url}
                    alt={capitalizeFirst(currentEvent.title)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
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