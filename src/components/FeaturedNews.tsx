import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface FeaturedNewsProps {
  news: any;
}

export const FeaturedNews = ({ news }: FeaturedNewsProps) => {
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
    <Card className="mb-8 overflow-hidden hover:shadow-xl transition-shadow bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative overflow-hidden group">
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full min-h-[400px] object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full min-h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Icon name="FileText" size={96} className="text-primary/40" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-600 text-white font-bold px-4 py-1.5 text-sm">
              <Icon name="Pin" size={14} className="mr-1 inline" />
              ГЛАВНАЯ НОВОСТЬ
            </Badge>
          </div>
        </div>
        <div className="p-8 flex flex-col justify-center">
          <Badge className="w-fit mb-3 bg-primary/10 text-primary hover:bg-primary/20">
            {news.category}
          </Badge>
          <h2 className="text-3xl font-serif font-bold mb-4 text-foreground leading-tight break-words">
            {news.title}
          </h2>
          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
            {news.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              {new Date(news.created_at).toLocaleDateString('ru-RU')}
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              {news.read_time}
            </div>
            <div className="flex items-center gap-2">
              <Icon name="User" size={16} />
              {news.author_name}
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