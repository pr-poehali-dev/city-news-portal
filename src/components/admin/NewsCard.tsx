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
  onToggleSVO?: (id: number) => void;
  onToggleShowbiz?: (id: number) => void;
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
  onSaveVkDraft,
  onToggleSVO,
  onToggleShowbiz
}: NewsCardProps) => {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('button') && !loading) {
      action();
    }
  };

  return (
    <div className="border rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="flex items-start justify-between gap-2 md:gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{news.category}</Badge>
            {news.is_featured && (
              <Badge className="bg-red-600 text-xs">
                <Icon name="Pin" size={10} className="mr-1" />
                Главная
              </Badge>
            )}
            {news.is_svo && (
              <Badge className="bg-red-600 text-white text-xs">
                <Icon name="Shield" size={10} className="mr-1" />
                СВО
              </Badge>
            )}
            {news.is_showbiz && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                <Icon name="Star" size={10} className="mr-1" />
                Шоубиз
              </Badge>
            )}
            {!isDraft && (
              <>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Icon name="Eye" size={10} />
                  {news.views || 0}
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Icon name="Heart" size={10} />
                  {news.likes || 0}
                </Badge>
              </>
            )}
            <span className="text-[10px] md:text-xs text-muted-foreground">
              {new Date(news.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
          <h3 className="font-semibold mb-1 line-clamp-2 text-sm md:text-base">{news.title}</h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{news.excerpt}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {isDraft && onPublish && (
          <Button 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!loading) onPublish(news);
            }}
            disabled={loading}
            className="text-xs md:text-sm h-8 touch-manipulation"
            type="button"
          >
            <Icon name="Upload" size={14} className="mr-1" />
            <span className="hidden sm:inline">Опубликовать</span>
            <span className="sm:hidden">Опубл.</span>
          </Button>
        )}
        {!isDraft && onSetFeatured && (
          <Button 
            size="sm" 
            variant={news.is_featured ? "default" : "secondary"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!loading && !news.is_featured) onSetFeatured(news.id);
            }}
            disabled={loading || news.is_featured}
            className="text-xs md:text-sm h-8 touch-manipulation"
            type="button"
          >
            <Icon name="Pin" size={14} className="mr-1" />
            <span className="hidden sm:inline">{news.is_featured ? 'Главная новость' : 'В главную'}</span>
            <span className="sm:hidden">Главная</span>
          </Button>
        )}
        {!isDraft && onPublishToTelegram && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!loading) onPublishToTelegram(news);
            }}
            disabled={loading}
            className="gap-1 text-xs md:text-sm h-8 touch-manipulation"
            type="button"
          >
            <Icon name="Send" size={14} />
            <span className="hidden sm:inline">Telegram</span>
            <span className="sm:hidden">TG</span>
          </Button>
        )}
        {!isDraft && onSaveVkDraft && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!loading) onSaveVkDraft();
            }}
            disabled={loading}
            className="gap-1 text-xs md:text-sm h-8 touch-manipulation"
            type="button"
          >
            <Icon name="FileText" size={14} />
            VK
          </Button>
        )}
        {!isDraft && onToggleSVO && (
          <Button 
            size="sm" 
            variant={news.is_svo ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!loading) onToggleSVO(news.id);
            }}
            disabled={loading}
            className="gap-1 text-xs md:text-sm h-8 touch-manipulation"
            type="button"
          >
            <Icon name="Shield" size={14} />
            <span className="hidden sm:inline">СВО</span>
          </Button>
        )}
        {!isDraft && onToggleShowbiz && (
          <Button 
            size="sm" 
            variant={news.is_showbiz ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!loading) onToggleShowbiz(news.id);
            }}
            disabled={loading}
            className="gap-1 text-xs md:text-sm h-8 touch-manipulation"
            type="button"
          >
            <Icon name="Sparkles" size={14} />
            <span className="hidden sm:inline">Шоубиз</span>
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!loading) onEdit(news);
          }}
          disabled={loading}
          className="text-xs md:text-sm h-8 touch-manipulation"
          type="button"
        >
          <Icon name="Edit" size={14} className="mr-1" />
          <span className="hidden sm:inline">Редактировать</span>
          <span className="sm:hidden">Ред.</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              variant="destructive"
              disabled={loading}
              className="text-xs md:text-sm h-8"
            >
              <Icon name="Trash2" size={14} className="mr-1 hidden sm:inline-block" />
              <span className="hidden sm:inline">Удалить</span>
              <Icon name="Trash2" size={14} className="sm:hidden" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base md:text-lg">Удалить новость?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Это действие нельзя отменить. Новость будет удалена навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="m-0">Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => handleClick(e, () => onDelete(news.id))}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};