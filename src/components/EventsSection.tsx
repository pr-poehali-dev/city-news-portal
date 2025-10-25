import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="relative -mx-4 px-4 py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-orange-950/30">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnpNNiA0OGMzLjMxIDAgNi0yLjY5IDYtNnMtMi42OS02LTYtNi02IDIuNjktNiA2IDIuNjkgNiA2IDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      
      <div className="container mx-auto relative">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
          <div className="flex items-center gap-3">
            <Icon name="Sparkles" size={24} className="text-primary" />
            <h2 className="text-3xl font-bold text-center">Афиша Краснодара</h2>
            <Icon name="Sparkles" size={24} className="text-primary" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/30" />
        </div>

        <p className="text-center text-muted-foreground mb-8">
          Лучшие события города от KudaGo
        </p>

        <div className="relative max-w-5xl mx-auto">
          <a
            href={currentEvent.kudago_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-primary/20 hover:border-primary/40 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-6">
                  {currentEvent.image_url ? (
                    <div className="relative h-80 md:h-full overflow-hidden">
                      <img 
                        src={currentEvent.image_url}
                        alt={capitalizeFirst(currentEvent.title)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {currentEvent.is_free && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                          БЕСПЛАТНО
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                        <Badge variant="secondary" className="backdrop-blur-sm bg-black/50 text-white border-white/20">
                          <Icon name="Calendar" size={14} className="mr-1" />
                          {currentIndex + 1} / {events.length}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-80 md:h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Icon name="Calendar" size={120} className="text-primary/20" />
                    </div>
                  )}
                  
                  <div className="p-8 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-4 gap-1">
                      <Icon name="ExternalLink" size={12} />
                      KudaGo
                    </Badge>

                    <h3 className="text-2xl font-bold mb-4 leading-tight hover:text-primary transition-colors">
                      {capitalizeFirst(currentEvent.title)}
                    </h3>
                    
                    {currentEvent.description && (
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                        {currentEvent.description}
                      </p>
                    )}

                    <div className="space-y-3">
                      {(currentEvent.event_date || currentEvent.event_date_display) && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon name="Clock" size={18} className="text-primary" />
                          </div>
                          <span className="font-medium">
                            {currentEvent.event_date_display || new Date(currentEvent.event_date!).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                      
                      {currentEvent.location && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon name="MapPin" size={18} className="text-primary" />
                          </div>
                          <span className="font-medium">{currentEvent.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 flex-wrap pt-2">
                        {currentEvent.price && !currentEvent.is_free && (
                          <Badge variant="secondary" className="gap-1">
                            <Icon name="Ticket" size={14} />
                            {currentEvent.price}
                          </Badge>
                        )}
                        {currentEvent.age_restriction && (
                          <Badge variant="outline" className="gap-1">
                            <Icon name="User" size={14} />
                            {currentEvent.age_restriction}+
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium">
                      <span>Подробнее на KudaGo</span>
                      <Icon name="ArrowRight" size={16} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 rounded-full shadow-lg bg-white dark:bg-gray-950 hover:bg-primary hover:text-white transition-all"
            onClick={handlePrev}
          >
            <Icon name="ChevronLeft" size={24} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 rounded-full shadow-lg bg-white dark:bg-gray-950 hover:bg-primary hover:text-white transition-all"
            onClick={handleNext}
          >
            <Icon name="ChevronRight" size={24} />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
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

        <div className="text-center mt-8">
          <a
            href="https://krd.kudago.com/events/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
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
