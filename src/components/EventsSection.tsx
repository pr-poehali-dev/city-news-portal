import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
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
  if (events.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-6 text-center">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Загрузка событий...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Афиша Краснодара</h2>
        <Badge variant="outline" className="gap-1">
          <Icon name="Sparkles" size={12} />
          KudaGo
        </Badge>
      </div>

      <div className="space-y-3">
        {events.slice(0, 5).map((event) => (
          <a
            key={event.id}
            href={event.kudago_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-primary">
              <CardContent className="p-0">
                <div className="flex gap-4">
                  {event.image_url ? (
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                      <img 
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.is_free && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          FREE
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Icon name="Calendar" size={32} className="text-primary/40" />
                    </div>
                  )}
                  
                  <div className="py-3 pr-4 flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1">
                      {event.event_date && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} className="flex-shrink-0" />
                          <span className="truncate">
                            {new Date(event.event_date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon name="MapPin" size={12} className="flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {event.price && !event.is_free && (
                          <Badge variant="secondary" className="text-xs">
                            {event.price}
                          </Badge>
                        )}
                        {event.age_restriction && (
                          <Badge variant="outline" className="text-xs">
                            {event.age_restriction}+
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <a
        href="https://krd.kudago.com/events/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center"
      >
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <span>Все события на KudaGo</span>
              <Icon name="ExternalLink" size={14} />
            </div>
          </CardContent>
        </Card>
      </a>
    </div>
  );
};
