import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface EventsSectionProps {
  events: any[];
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  if (events.length === 0) return null;

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  return (
    <>
      <Separator className="my-12" />
      
      <section>
        <h2 className="text-3xl font-serif font-bold mb-6 text-primary">
          Афиша событий
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {event.image_url ? (
                <img 
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-secondary/20 flex items-center justify-center">
                  <Icon name="Calendar" size={48} className="text-secondary/40" />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-serif font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(event.event_date).toLocaleString('ru-RU')}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="MapPin" size={14} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};