import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MiniNewsCardProps {
  news: any;
  onClick: () => void;
  onLike?: (e: React.MouseEvent) => void;
  hasLiked?: boolean;
}

export const MiniNewsCard = ({ news, onClick, onLike, hasLiked = false }: MiniNewsCardProps) => {
  return (
    <div 
      className="flex gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow group"
    >
      <div onClick={onClick} className="flex gap-3 flex-1 cursor-pointer">
        {news.image_url ? (
          <img 
            src={news.image_url} 
            alt={news.title}
            className="w-20 h-20 object-cover rounded flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 bg-secondary/20 rounded flex items-center justify-center flex-shrink-0">
            <Icon name="FileText" size={24} className="text-secondary/40" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Badge className="mb-1 text-xs">{news.category}</Badge>
          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Icon name="Calendar" size={12} />
            {new Date(news.created_at).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </div>
      {onLike && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={`gap-1 h-auto px-2 ${hasLiked ? 'text-red-500' : ''}`}
        >
          <Icon name="Heart" size={14} className={hasLiked ? 'fill-current' : ''} />
          <span className="text-xs">{news.likes || 0}</span>
        </Button>
      )}
    </div>
  );
};