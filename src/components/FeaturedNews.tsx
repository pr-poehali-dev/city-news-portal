import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface FeaturedNewsProps {
  news: any;
  allTopNews?: any[];
  currentIndex?: number;
  totalCount?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onClick?: () => void;
  onNewsClick?: (newsId: number) => void;
}

export const FeaturedNews = ({ 
  news, 
  allTopNews = [],
  currentIndex = 0, 
  totalCount = 1,
  onNavigate,
  onClick,
  onNewsClick
}: FeaturedNewsProps) => {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

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

  const otherNews = allTopNews.filter((_, idx) => idx !== currentIndex);

  return (
    <div className="mb-8">
      <div className="grid md:grid-cols-[1fr_300px] gap-4">
        <Card 
          className="overflow-hidden hover:shadow-xl transition-shadow bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 cursor-pointer"
          onClick={onClick}
        >
          <div className="relative overflow-hidden group">
            {news.image_url ? (
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-[400px] object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-[400px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
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
          <div className="p-6">
            <Badge className="w-fit mb-2 bg-orange-500 text-white text-sm">
              {news.category}
            </Badge>
            <h2 className="text-2xl font-serif font-bold mb-3 text-foreground leading-tight">
              {news.title}
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed mb-4">
              <p className="line-clamp-3">
                {stripHtml(news.excerpt || news.content)}
              </p>
              <span className="text-primary font-medium text-sm mt-2 inline-block cursor-pointer hover:underline">
                Читать далее →
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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

        <div className="hidden md:flex flex-col gap-4">
          {otherNews.map((item, idx) => (
            <Card 
              key={item.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/40"
              onClick={() => onNewsClick?.(item.id)}
            >
              <div className="relative overflow-hidden group">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-[150px] object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-[150px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Icon name="FileText" size={32} className="text-primary/30" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <Badge className="w-fit mb-1.5 text-xs">
                  {item.category}
                </Badge>
                <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};