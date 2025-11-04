import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface NewsSectionProps {
  articles: any[];
  newsCategories: string[];
  currentCategoryIndex: number;
  availableCategories: string[];
  onCategoryChange: (direction: 'prev' | 'next') => void;
  onArticleClick: (newsId: number) => void;
  onLike: (newsId: number) => void;
  likedArticles: Set<number>;
}

export function NewsSection({
  articles,
  newsCategories,
  currentCategoryIndex,
  availableCategories,
  onCategoryChange,
  onArticleClick,
  onLike,
  likedArticles,
}: NewsSectionProps) {
  const currentCategory = availableCategories[currentCategoryIndex];
  const categoryNews = articles.filter(a => a.category === currentCategory);

  const stripHtml = (html: string) => {
    if (!html) return '';
    
    let text = html;
    
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&ndash;/gi, '-');
    text = text.replace(/&rsquo;/gi, "'");
    text = text.replace(/&lsquo;/gi, "'");
    text = text.replace(/&rdquo;/gi, '"');
    text = text.replace(/&ldquo;/gi, '"');
    text = text.replace(/&hellip;/gi, '...');
    text = text.replace(/&[a-z]+;/gi, ' ');
    
    text = text.replace(/[\u00a0\u202f\u2009\u2000-\u200b]/g, ' ');
    text = text.replace(/[\u2011-\u2015]/g, '-');
    text = text.replace(/[\u2018\u2019]/g, "'");
    text = text.replace(/[\u201c\u201d]/g, '"');
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  };

  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
        <h2 className="text-2xl md:text-3xl font-serif font-black tracking-tight">{currentCategory}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onCategoryChange('prev')}
            disabled={availableCategories.length <= 1}
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onCategoryChange('next')}
            disabled={availableCategories.length <= 1}
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {categoryNews.slice(0, 4).map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-md transition-all border-0 shadow-sm group"
          >
            <CardContent className="p-0">
              {article.image_url && (
                <div className="relative h-32 md:h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wide">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>

                <h3
                  onClick={() => onArticleClick(article.id)}
                  className="text-base md:text-lg font-serif font-bold mb-2 group-hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-tight"
                >
                  {article.title}
                </h3>

                <p className="text-muted-foreground text-xs mb-3 line-clamp-2 hidden md:block">
                  {stripHtml(article.excerpt)}
                </p>

                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(article.id);
                    }}
                    className={`flex items-center gap-1 transition-colors ${
                      likedArticles.has(article.id)
                        ? 'text-red-500'
                        : 'hover:text-red-500'
                    }`}
                    disabled={likedArticles.has(article.id)}
                  >
                    <Icon
                      name={likedArticles.has(article.id) ? 'Heart' : 'Heart'}
                      size={16}
                      className={likedArticles.has(article.id) ? 'fill-current' : ''}
                    />
                    <span>{article.likes || 0}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Icon name="MessageCircle" size={16} />
                    <span>{article.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categoryNews.length > 4 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 px-8"
            onClick={() => {
              const categoryMap: Record<string, string> = {
                'Политика': 'politics',
                'Экономика': 'economy',
                'Культура': 'culture',
                'Спорт': 'sport'
              };
              const categoryPath = categoryMap[currentCategory] || 'politics';
              window.location.href = `/${categoryPath}`;
            }}
          >
            <span>Читать все новости</span>
            <Icon name="ArrowRight" size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}