import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AuthorFormProps {
  authorForm: {
    name: string;
    position: string;
    bio: string;
    photo_url: string;
  };
  loading: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthorForm = ({ authorForm, loading, onFormChange, onSubmit }: AuthorFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить автора/сотрудника</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Имя и фамилия</label>
            <Input
              value={authorForm.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              required
              placeholder="Имя Фамилия"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Должность</label>
            <Input
              value={authorForm.position}
              onChange={(e) => onFormChange('position', e.target.value)}
              placeholder="Журналист, Редактор..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Биография</label>
            <Textarea
              value={authorForm.bio}
              onChange={(e) => onFormChange('bio', e.target.value)}
              placeholder="Краткая биография"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ссылка на фото</label>
            <Input
              value={authorForm.photo_url}
              onChange={(e) => onFormChange('photo_url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Добавление...' : 'Добавить автора'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
