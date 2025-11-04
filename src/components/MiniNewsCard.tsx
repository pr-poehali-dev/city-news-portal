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
      className="flex gap-4 p-4 border-0 bg-card rounded-2xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-1"
    >
      <div onClick={onClick} className="flex gap-4 flex-1 cursor-pointer">
        {news.image_url ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <img 
              src={news.image_url} 
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            <Icon name="Newspaper" size={32} className="text-primary/40 relative z-10" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Badge className="mb-2 text-xs bg-primary/10 text-primary border-0 rounded-full px-2.5 py-0.5">{news.category}</Badge>
          <h4 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors mb-1.5 leading-snug">
            {news.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Calendar" size={12} />
            <span className="font-medium">{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
      {onLike && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={`gap-1.5 h-auto px-3 rounded-full hover:bg-primary/10 transition-all ${hasLiked ? 'text-red-500' : ''}`}
        >
          <Icon name="Heart" size={16} className={hasLiked ? 'fill-current' : ''} />
          <span className="text-sm font-semibold">{news.likes || 0}</span>
        </Button>
      )}
    </div>
  );
};
