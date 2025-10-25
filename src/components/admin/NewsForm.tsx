import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ImageUpload } from './ImageUpload';

interface NewsFormProps {
  newsForm: {
    title: string;
    category: string;
    excerpt: string;
    content: string;
    image_url: string;
    video_url: string;
    read_time: string;
  };
  categories: string[];
  loading: boolean;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent, isDraft: boolean) => void;
}

export const NewsForm = ({ newsForm, categories, loading, onFormChange, onSubmit }: NewsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить новость</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => onSubmit(e, false)} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Заголовок</label>
            <Input
              value={newsForm.title}
              onChange={(e) => onFormChange('title', e.target.value)}
              required
              placeholder="Заголовок новости"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Категория (тег)</label>
            <Select
              value={newsForm.category || ''}
              onValueChange={(value) => onFormChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Краткое описание</label>
            <Textarea
              value={newsForm.excerpt}
              onChange={(e) => onFormChange('excerpt', e.target.value)}
              required
              placeholder="Краткое описание для карточки"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Полный текст</label>
            <Textarea
              value={newsForm.content}
              onChange={(e) => onFormChange('content', e.target.value)}
              placeholder="Полный текст новости"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Изображение</label>
            <ImageUpload
              value={newsForm.image_url}
              onChange={(url) => onFormChange('image_url', url)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ссылка на видео (YouTube, Rutube)</label>
            <Input
              value={newsForm.video_url}
              onChange={(e) => onFormChange('video_url', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Время чтения</label>
            <Input
              value={newsForm.read_time}
              onChange={(e) => onFormChange('read_time', e.target.value)}
              placeholder="5 мин"
            />
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <Icon name="User" size={16} className="inline mr-2" />
            Автор: <strong>Никита Москвин</strong>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Публикация...' : 'Опубликовать'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={(e) => onSubmit(e as any, true)}
              disabled={loading}
            >
              Сохранить черновик
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};