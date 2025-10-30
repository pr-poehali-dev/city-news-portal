import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ImageUpload } from './ImageUpload';
import { RichTextEditor } from './RichTextEditor';
import { TAGS } from '@/lib/admin-constants';

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
    tags?: string[];
    keywords?: string;
  };
  categories: string[];
  loading: boolean;
  onFormChange: (field: string, value: string | boolean | string[]) => void;
  onSubmit: (e: React.FormEvent, isDraft: boolean) => void;
  onSaveVkDraft?: () => void;
}

export const NewsForm = ({ newsForm, categories, loading, onFormChange, onSubmit, onSaveVkDraft }: NewsFormProps) => {
  const [showKeywordsHelp] = useState(false);

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
            <label className="text-sm font-medium mb-2 block">Категория</label>
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
            <label className="text-sm font-medium mb-2 block">Теги</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
              {TAGS.map(tag => {
                const isSelected = newsForm.tags?.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => {
                      const currentTags = newsForm.tags || [];
                      const newTags = isSelected
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag];
                      onFormChange('tags', newTags);
                    }}
                  >
                    {tag}
                    {isSelected && (
                      <Icon name="X" size={12} className="ml-1" />
                    )}
                  </Badge>
                );
              })}
              {(!newsForm.tags || newsForm.tags.length === 0) && (
                <span className="text-sm text-muted-foreground">Не выбрано</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <Icon name="Info" size={12} className="inline mr-1" />
              Новости с тегом "СВО" публикуются только в разделе СВО
            </p>
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
            <RichTextEditor
              content={newsForm.content}
              onChange={(content) => onFormChange('content', content)}
              placeholder="Начните писать новость. Используйте панель инструментов для форматирования текста и вставки изображений."
            />
            <p className="text-xs text-muted-foreground mt-2">
              <Icon name="Info" size={12} className="inline mr-1" />
              Используйте кнопку <Icon name="Image" size={12} className="inline mx-1" /> или <Icon name="Upload" size={12} className="inline mx-1" /> на панели инструментов для добавления изображений в текст
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Изображение обложки</label>
            <ImageUpload
              value={newsForm.image_url}
              onChange={(url) => onFormChange('image_url', url)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Главное изображение для карточки новости и соцсетей
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ключевые слова</label>
            <Input
              value={newsForm.keywords || ''}
              onChange={(e) => onFormChange('keywords', e.target.value)}
              placeholder="Краснодар, новости, события (через запятую)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              <Icon name="Hash" size={12} className="inline mr-1" />
              Ключевые слова для SEO и хештегов в соцсетях (через запятую)
            </p>
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!loading) onSubmit(e as any, true);
              }}
              disabled={loading}
              className="min-w-[150px]"
            >
              Сохранить черновик
            </Button>
            {onSaveVkDraft && (
              <Button 
                type="button" 
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!loading) onSaveVkDraft();
                }}
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