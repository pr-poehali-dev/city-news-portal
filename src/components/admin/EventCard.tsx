import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface EventCardProps {
  event: any;
  loading: boolean;
  onDelete: () => void;
}

export const EventCard = ({ event, loading, onDelete }: EventCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div>
        <h3 className="font-semibold mb-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Calendar" size={12} />
            {new Date(event.event_date).toLocaleString('ru-RU')}
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={12} />
              {event.location}
            </div>
          )}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            size="sm" 
            variant="destructive"
            disabled={loading}
          >
            <Icon name="Trash2" size={14} className="mr-1" />
            Удалить
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить событие?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Событие будет удалено навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
