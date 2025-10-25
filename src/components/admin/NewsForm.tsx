import { useState, useRef } from 'react';
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
    publish_telegram?: boolean;
  };
  categories: string[];
  loading: boolean;
  onFormChange: (field: string, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent, isDraft: boolean) => void;
  onSaveVkDraft?: () => void;
}

export const NewsForm = ({ newsForm, categories, loading, onFormChange, onSubmit, onSaveVkDraft }: NewsFormProps) => {
  const [imageUrlForInsert, setImageUrlForInsert] = useState('');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const insertImageIntoContent = (imageUrl: string) => {
    if (!imageUrl) return;
    
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart || newsForm.content.length;
    const textBefore = newsForm.content.substring(0, cursorPos);
    const textAfter = newsForm.content.substring(cursorPos);
    
    const imageMarkdown = `\n![Изображение](${imageUrl})\n`;
    const newContent = textBefore + imageMarkdown + textAfter;
    
    onFormChange('content', newContent);
    setImageUrlForInsert('');
    
    setTimeout(() => {
      textarea.focus();
      const newPos = cursorPos + imageMarkdown.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
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
              ref={contentTextareaRef}
              value={newsForm.content}
              onChange={(e) => onFormChange('content', e.target.value)}
              placeholder="Полный текст новости. Используйте ![Описание](URL) для вставки изображений"
              rows={8}
            />
            <div className="mt-2 p-3 bg-muted rounded-lg space-y-3">
              <div className="text-xs font-medium">Вставить изображение в текст:</div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Вставьте URL изображения"
                  value={imageUrlForInsert}
                  onChange={(e) => setImageUrlForInsert(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => insertImageIntoContent(imageUrlForInsert)}
                  disabled={!imageUrlForInsert}
                >
                  <Icon name="Image" size={16} className="mr-1" />
                  Вставить
                </Button>
              </div>
              <div className="flex gap-2">
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
                  className="flex-1"
                >
                  <Icon name="Upload" size={16} className="mr-1" />
                  Загрузить с компьютера
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                <Icon name="Info" size={12} className="inline mr-1" />
                Изображения будут вставлены в текущую позицию курсора
              </div>
            </div>
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

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">Автоматическая публикация в Telegram</div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsForm.publish_telegram ?? true}
                  onChange={(e) => onFormChange('publish_telegram', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Опубликовать в Telegram канале</span>
              </label>
            </div>
            <div className="text-xs text-muted-foreground">
              Новость будет автоматически опубликована в Telegram канале при публикации
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button type="submit" className="flex-1 min-w-[200px]" disabled={loading}>
              {loading ? 'Публикация...' : 'Опубликовать'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={(e) => onSubmit(e as any, true)}
              disabled={loading}
              className="min-w-[150px]"
            >
              Сохранить черновик
            </Button>
            {onSaveVkDraft && (
              <Button 
                type="button" 
                variant="secondary"
                onClick={onSaveVkDraft}
                disabled={loading}
                className="gap-1 min-w-[150px]"
              >
                <Icon name="FileText" size={14} />
                Черновик VK
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};