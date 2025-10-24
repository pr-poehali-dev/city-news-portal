import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface NewsEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: any;
  setNews: (news: any) => void;
  categories: string[];
  loading: boolean;
  onSave: () => Promise<void>;
}

export const NewsEditDialog = ({
  open,
  onOpenChange,
  news,
  setNews,
  categories,
  loading,
  onSave
}: NewsEditDialogProps) => {
  const updateField = (field: string, value: any) => {
    if (!news) return;
    setNews({ ...news, [field]: value });
  };

  if (!news) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать новость</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Заголовок</Label>
            <Input
              value={news.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          <div>
            <Label>Категория</Label>
            <Select
              value={news.category || ''}
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Краткое описание</Label>
            <Textarea
              value={news.excerpt || ''}
              onChange={(e) => updateField('excerpt', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>Содержание</Label>
            <Textarea
              value={news.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
              rows={6}
            />
          </div>

          <div>
            <Label>URL изображения</Label>
            <Input
              value={news.image_url || ''}
              onChange={(e) => updateField('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label>URL видео (опционально)</Label>
            <Input
              value={news.video_url || ''}
              onChange={(e) => updateField('video_url', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <Label>Время чтения</Label>
            <Input
              value={news.read_time || ''}
              onChange={(e) => updateField('read_time', e.target.value)}
              placeholder="5 мин"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={news.is_featured || false}
              onCheckedChange={(checked) => updateField('is_featured', checked)}
            />
            <Label>Закрепить в главной</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};