import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface EventFormProps {
  eventForm: {
    title: string;
    description: string;
    event_date: string;
    location: string;
    image_url: string;
  };
  loading: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EventForm = ({ eventForm, loading, onFormChange, onSubmit }: EventFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить событие</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Название</label>
            <Input
              value={eventForm.title}
              onChange={(e) => onFormChange('title', e.target.value)}
              required
              placeholder="Название события"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Описание</label>
            <Textarea
              value={eventForm.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              required
              placeholder="Описание события"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Дата и время</label>
            <Input
              type="datetime-local"
              value={eventForm.event_date}
              onChange={(e) => onFormChange('event_date', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Место проведения</label>
            <Input
              value={eventForm.location}
              onChange={(e) => onFormChange('location', e.target.value)}
              placeholder="Адрес или название места"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ссылка на изображение</label>
            <Input
              value={eventForm.image_url}
              onChange={(e) => onFormChange('image_url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Добавление...' : 'Добавить событие'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
