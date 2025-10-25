import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface FeaturedNewsProps {
  news: any;
  currentIndex?: number;
  totalCount?: number;
}

export const FeaturedNews = ({ news, currentIndex = 0, totalCount = 1 }: FeaturedNewsProps) => {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getRutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/rutube\.ru\/video\/([^/\s]+)/)?.[1];
    return videoId ? `https://rutube.ru/play/embed/${videoId}` : null;
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeEmbedUrl(url);
    } else if (url.includes('rutube.ru')) {
      return getRutubeEmbedUrl(url);
    }
    return null;
  };

  return (
    <Card className="mb-8 overflow-hidden hover:shadow-xl transition-shadow bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 cursor-pointer">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative overflow-hidden group">
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full min-h-[200px] md:min-h-[300px] object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full min-h-[200px] md:min-h-[300px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Icon name="FileText" size={64} className="text-primary/40" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-600 text-white font-bold px-3 py-1 text-xs">
              <Icon name="Pin" size={12} className="mr-1 inline" />
              ГЛАВНАЯ
            </Badge>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col justify-center overflow-hidden">
          <Badge className="w-fit mb-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs">
            {news.category}
          </Badge>
          <h2 className="text-base md:text-lg font-serif font-bold mb-3 text-foreground leading-snug break-all line-clamp-3">
            {news.title}
          </h2>
          <p className="text-muted-foreground mb-4 text-xs md:text-sm leading-relaxed line-clamp-2 break-words">
            {news.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <span className="truncate">{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={14} />
              <span className="truncate">{news.read_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="User" size={14} />
              <span className="truncate">{news.author_name}</span>
            </div>
          </div>
          
          {totalCount > 1 && (
            <div className="flex gap-2 mt-4">
              {Array.from({ length: totalCount }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {news.video_url && (
        <div className="border-t">
          <iframe
            width="100%"
            height="450"
            src={getEmbedUrl(news.video_url) || ''}
            title="Video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full"
          />
        </div>
      )}
    </Card>
  );
};