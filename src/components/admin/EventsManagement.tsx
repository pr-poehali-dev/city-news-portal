import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventForm } from './EventForm';
import { EventCard } from './EventCard';

interface EventsManagementProps {
  eventForm: any;
  setEventForm: (form: any) => void;
  eventsList: any[];
  loading: boolean;
  onEventSubmit: (e: React.FormEvent) => Promise<void>;
  onDeleteEvent: (id: number) => Promise<void>;
}

export const EventsManagement = ({
  eventForm,
  setEventForm,
  eventsList,
  loading,
  onEventSubmit,
  onDeleteEvent
}: EventsManagementProps) => {
  return (
    <div className="space-y-6">
      <EventForm
        eventForm={eventForm}
        loading={loading}
        onFormChange={(field, value) => setEventForm({ ...eventForm, [field]: value })}
        onSubmit={onEventSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>Список событий</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {eventsList.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={onDeleteEvent}
                loading={loading}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};