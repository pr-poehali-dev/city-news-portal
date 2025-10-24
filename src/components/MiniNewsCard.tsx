import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface MiniNewsCardProps {
  news: any;
  onClick: () => void;
}

export const MiniNewsCard = ({ news, onClick }: MiniNewsCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group bg-card"
    >
      {news.image_url ? (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={news.image_url} 
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      ) : (
        <div className="h-48 bg-secondary/20 flex items-center justify-center">
          <Icon name="FileText" size={48} className="text-secondary/40" />
        </div>
      )}
      <div className="p-4">
        <Badge className="mb-2 text-xs">{news.category}</Badge>
        <h4 className="font-bold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {news.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Calendar" size={14} />
          {new Date(news.created_at).toLocaleDateString('ru-RU')}
        </div>
      </div>
    </div>
  );
};