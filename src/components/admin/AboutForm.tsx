import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AboutFormProps {
  aboutForm: {
    title: string;
    content: string;
  };
  loading: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const AboutForm = ({ aboutForm, loading, onFormChange, onSubmit }: AboutFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактировать раздел "О портале"</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Заголовок</label>
          <Input
            value={aboutForm.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            placeholder="О портале"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Содержание</label>
          <Textarea
            value={aboutForm.content}
            onChange={(e) => onFormChange('content', e.target.value)}
            placeholder="Описание портала, цели и задачи..."
            rows={8}
          />
        </div>

        <Button onClick={onSubmit} className="w-full" disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </CardContent>
    </Card>
  );
};
