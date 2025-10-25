import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from './ImageUpload';
import Icon from '@/components/ui/icon';
import { useCallback, useRef, useState } from 'react';

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
  const [imageUrlForInsert, setImageUrlForInsert] = useState('');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const updateField = useCallback((field: string, value: any) => {
    setNews((prev: any) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }, [setNews]);

  const insertImageIntoContent = (imageUrl: string) => {
    if (!imageUrl || !news) return;
    
    const textarea = contentTextareaRef.current;
    const currentContent = news.content || '';
    const cursorPos = textarea?.selectionStart || currentContent.length;
    
    const textBefore = currentContent.substring(0, cursorPos);
    const textAfter = currentContent.substring(cursorPos);
    
    const imageMarkdown = `\n![Изображение](${imageUrl})\n`;
    const newContent = textBefore + imageMarkdown + textAfter;
    
    updateField('content', newContent);
    setImageUrlForInsert('');
  };

  const handleImageUploadForContent = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://cdn.poehali.dev/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const imageUrl = data.url || data.file_url;
      
      if (imageUrl) {
        insertImageIntoContent(imageUrl);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Ошибка загрузки изображения');
    }
  };

  if (!news) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
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
              key={news.id || 'select-key'}
              value={news.category || ''}
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
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
              ref={contentTextareaRef}
              value={news.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
              rows={6}
              placeholder="Используйте ![Описание](URL) для вставки изображений"
            />
            <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
              <div className="text-xs font-medium">Вставить изображение в текст:</div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="URL изображения"
                  value={imageUrlForInsert}
                  onChange={(e) => setImageUrlForInsert(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => insertImageIntoContent(imageUrlForInsert)}
                  disabled={!imageUrlForInsert}
                >
                  <Icon name="Image" size={14} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: any) => {
                      const file = e.target?.files?.[0];
                      if (file) handleImageUploadForContent(file);
                    };
                    input.click();
                  }}
                >
                  <Icon name="Upload" size={14} />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Изображение</Label>
            <ImageUpload
              value={news.image_url || ''}
              onChange={(url) => updateField('image_url', url)}
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