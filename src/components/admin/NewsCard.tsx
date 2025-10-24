import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface NewsCardProps {
  news: any;
  isDraft: boolean;
  loading: boolean;
  editingNews: any;
  editDialogOpen: boolean;
  categories: string[];
  onPublishDraft?: () => void;
  onSetFeatured?: () => void;
  onEdit: (news: any) => void;
  onEditDialogChange: (open: boolean) => void;
  onEditingNewsChange: (news: any) => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}

export const NewsCard = ({
  news,
  isDraft,
  loading,
  editingNews,
  editDialogOpen,
  categories,
  onPublishDraft,
  onSetFeatured,
  onEdit,
  onEditDialogChange,
  onEditingNewsChange,
  onSaveEdit,
  onDelete
}: NewsCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline">{news.category}</Badge>
            {news.is_featured && (
              <Badge className="bg-red-600">
                <Icon name="Pin" size={12} className="mr-1" />
                Главная
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(news.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <h3 className="font-semibold mb-1 line-clamp-2">{news.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {isDraft && onPublishDraft && (
          <Button 
            size="sm" 
            onClick={onPublishDraft}
            disabled={loading}
          >
            <Icon name="Upload" size={14} className="mr-1" />
            Опубликовать
          </Button>
        )}
        {!isDraft && onSetFeatured && (
          <Button 
            size="sm" 
            variant={news.is_featured ? "default" : "secondary"}
            onClick={onSetFeatured}
            disabled={loading || news.is_featured}
          >
            <Icon name="Pin" size={14} className="mr-1" />
            {news.is_featured ? 'Главная новость' : 'В главную'}
          </Button>
        )}
        <Dialog open={editDialogOpen && editingNews?.id === news.id} onOpenChange={onEditDialogChange}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEdit({
                ...news,
                image_url: news.image_url || '',
                video_url: news.video_url || '',
                read_time: news.read_time || '5 мин'
              })}
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Редактировать
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl max-h-[80vh] overflow-y-auto"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Редактировать новость</DialogTitle>
            </DialogHeader>
            {editingNews && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Заголовок</label>
                  <Input
                    value={editingNews.title}
                    onChange={(e) => onEditingNewsChange({ ...editingNews, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <Select
                    value={editingNews.category}
                    onValueChange={(value) => onEditingNewsChange({ ...editingNews, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                    value={editingNews.excerpt}
                    onChange={(e) => onEditingNewsChange({ ...editingNews, excerpt: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Полный текст</label>
                  <Textarea
                    value={editingNews.content}
                    onChange={(e) => onEditingNewsChange({ ...editingNews, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ссылка на изображение</label>
                  <Input
                    value={editingNews.image_url || ''}
                    onChange={(e) => onEditingNewsChange({ ...editingNews, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ссылка на видео (YouTube, Rutube)</label>
                  <Input
                    value={editingNews.video_url || ''}
                    onChange={(e) => onEditingNewsChange({ ...editingNews, video_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Время чтения</label>
                  <Input
                    value={editingNews.read_time}
                    onChange={(e) => onEditingNewsChange({ ...editingNews, read_time: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={onSaveEdit} className="flex-1" disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onEditDialogChange(false)}
                    disabled={loading}
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
              <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Новость будет удалена навсегда.
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
    </div>
  );
};