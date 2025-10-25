import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface NewsCardProps {
  news: any;
  isDraft?: boolean;
  loading: boolean;
  onPublish?: (draft: any) => void;
  onSetFeatured?: (id: number) => void;
  onEdit: (news: any) => void;
  onDelete: (id: number) => void;
  onPublishToTelegram?: (news: any) => void;
  onSaveVkDraft?: () => void;
}

export const NewsCard = ({
  news,
  isDraft = false,
  loading,
  onPublish,
  onSetFeatured,
  onEdit,
  onDelete,
  onPublishToTelegram,
  onSaveVkDraft
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
            {!isDraft && (
              <>
                <Badge variant="secondary" className="gap-1">
                  <Icon name="Eye" size={12} />
                  {news.views || 0}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Icon name="Heart" size={12} />
                  {news.likes || 0}
                </Badge>
              </>
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
        {isDraft && onPublish && (
          <Button 
            size="sm" 
            onClick={() => onPublish(news)}
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
            onClick={() => onSetFeatured(news.id)}
            disabled={loading || news.is_featured}
          >
            <Icon name="Pin" size={14} className="mr-1" />
            {news.is_featured ? 'Главная новость' : 'В главную'}
          </Button>
        )}
        {!isDraft && onPublishToTelegram && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onPublishToTelegram(news)}
            disabled={loading}
            className="gap-1"
          >
            <Icon name="Send" size={14} />
            Telegram
          </Button>
        )}
        {!isDraft && onSaveVkDraft && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onSaveVkDraft}
            disabled={loading}
            className="gap-1"
          >
            <Icon name="FileText" size={14} />
            VK черновик
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onEdit(news)}
        >
          <Icon name="Edit" size={14} className="mr-1" />
          Редактировать
        </Button>
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
              <AlertDialogAction onClick={() => onDelete(news.id)}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};