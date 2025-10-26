import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { SEO } from '@/components/SEO';
import { SEO } from '@/components/SEO';
import { useEffect } from 'react';

interface NewsArticleProps {
  article: any;
  isExpanded: boolean;
  comments: any[];
  commentName: string;
  commentText: string;
  relatedNews?: any[];
  onToggle: () => void;
  onCommentNameChange: (value: string) => void;
  onCommentTextChange: (value: string) => void;
  onAddComment: () => void;
  onRelatedClick?: (newsId: number) => void;
  onLike?: () => void;
  hasLiked?: boolean;
}

export const NewsArticle = ({
  article,
  isExpanded,
  comments,
  commentName,
  commentText,
  relatedNews = [],
  onToggle,
  onCommentNameChange,
  onCommentTextChange,
  onAddComment,
  onRelatedClick,
  onLike,
  hasLiked = false
}: NewsArticleProps) => {
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

  const renderContentWithImages = (content: string) => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = imageRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const alt = match[1] || 'Изображение';
      const imageUrl = match[2];
      
      parts.push(
        <img 
          key={key++}
          src={imageUrl} 
          alt={alt}
          className="w-full max-w-2xl mx-auto rounded-lg my-4 object-contain"
          style={{ maxHeight: '500px' }}
        />
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts;
  };

  const getArticleDescription = () => {
    if (article.excerpt) return article.excerpt;
    if (article.content) {
      const plainText = article.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').trim();
      return plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    }
    return 'Читайте новости Краснодара на портале Город говорит';
  };

  return (
    <>
      {isExpanded && (
        <SEO
          title={article.title}
          description={getArticleDescription()}
          image={article.image_url}
          type="article"
          url={`https://ggkrasnodar.ru/#news-${article.id}`}
          article={{
            publishedTime: article.created_at,
            modifiedTime: article.updated_at,
            author: 'Город говорит',
            section: article.category,
            tags: [article.category, 'Краснодар', 'новости']
          }}
        />
      )}
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {article.image_url && (
        <div className="relative overflow-hidden group">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-56 object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary">
            {article.category}
          </Badge>
        </div>
      )}
      <CardContent className="p-6">
        {!article.image_url && (
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
            {article.category}
          </Badge>
        )}
        <h2 className="text-2xl font-serif font-bold mb-3 leading-tight hover:text-primary transition-colors cursor-pointer break-words">
          {article.title}
        </h2>
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              {new Date(article.created_at).toLocaleDateString('ru-RU')}
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={14} />
              {new Date(article.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-1">
              <Icon name="User" size={14} />
              {article.author_name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className={`gap-1 ${hasLiked ? 'text-red-500' : ''}`}
              >
                <Icon name={hasLiked ? "Heart" : "Heart"} size={16} className={hasLiked ? 'fill-current' : ''} />
                <span className="text-xs">{article.likes || 0}</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="gap-2"
            >
              {isExpanded ? (
                <>
                  Свернуть <Icon name="ChevronUp" size={16} />
                </>
              ) : (
                <>
                  Читать далее <Icon name="ChevronDown" size={16} />
                </>
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            <Separator />
            <div className="prose max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {renderContentWithImages(article.content)}
              </div>
            </div>

            {article.video_url && (
              <>
                <Separator className="my-6" />
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={getEmbedUrl(article.video_url) || ''}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
                <Separator className="my-6" />
              </>
            )}

            <h3 className="text-xl font-serif font-bold mb-4">
              Комментарии ({comments?.length || 0})
            </h3>

            <div className="space-y-4 mb-6">
              {comments?.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{comment.author_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm ml-10">{comment.text}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <h4 className="font-semibold">Оставить комментарий</h4>
              <Input
                placeholder="Ваше имя"
                value={commentName}
                onChange={(e) => onCommentNameChange(e.target.value)}
              />
              <Textarea
                placeholder="Ваш комментарий..."
                value={commentText}
                onChange={(e) => onCommentTextChange(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={onAddComment}
                className="w-full"
              >
                Отправить комментарий
              </Button>
            </div>

            {relatedNews.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="font-semibold mb-3">Читайте также</h4>
                  <div className="space-y-2">
                    {relatedNews.map((related) => (
                      <div
                        key={related.id}
                        onClick={() => onRelatedClick?.(related.id)}
                        className="flex gap-3 p-2 rounded hover:bg-accent cursor-pointer transition-colors"
                      >
                        {related.image_url && (
                          <img 
                            src={related.image_url} 
                            alt={related.title}
                            className="w-16 h-16 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{related.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(related.created_at).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
};