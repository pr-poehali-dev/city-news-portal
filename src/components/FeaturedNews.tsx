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
      <div className="grid md:grid-cols-[35%_65%] gap-0">
        <div className="relative overflow-hidden group">
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-[200px] md:h-[280px] object-contain bg-muted transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-[200px] md:h-[280px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Icon name="FileText" size={64} className="text-primary/40" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-orange-500 text-white font-bold px-3 py-1 text-xs shadow-lg">
              <Icon name="Pin" size={12} className="mr-1 inline" />
              ГЛАВНАЯ
            </Badge>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col justify-between min-h-[200px] md:min-h-[280px]">
          <div className="overflow-hidden">
            <Badge className="w-fit mb-2 bg-orange-500 text-white text-sm">
              {news.category}
            </Badge>
            <h2 className="text-lg md:text-xl font-serif font-bold mb-3 text-foreground leading-tight line-clamp-2">
              {news.title}
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed overflow-hidden">
              <div className="line-clamp-3 md:line-clamp-4 whitespace-pre-wrap">
                {news.content || news.excerpt}
              </div>
              <span className="text-primary font-medium text-sm mt-1 inline-block cursor-pointer hover:underline">
                Читать далее →
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Icon name="Calendar" size={16} />
              <span>{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Clock" size={16} />
              <span>{new Date(news.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="User" size={16} />
              <span>{news.author_name}</span>
            </div>
          </div>
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