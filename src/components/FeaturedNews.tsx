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
      <div className="grid md:grid-cols-[40%_60%] gap-0">
        <div className="relative overflow-hidden group">
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full min-h-[200px] md:min-h-[400px] object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full min-h-[200px] md:min-h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
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
        <div className="p-4 md:p-8 flex flex-col justify-start overflow-hidden">
          <Badge className="w-fit mb-3 bg-orange-500 text-white text-sm">
            {news.category}
          </Badge>
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-4 text-foreground leading-snug">
            {news.title}
          </h2>
          <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed hidden md:line-clamp-none md:block">
            {news.content || news.excerpt}
          </p>
          <p className="text-muted-foreground mb-4 text-xs leading-relaxed line-clamp-2 md:hidden">
            {news.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-auto">
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