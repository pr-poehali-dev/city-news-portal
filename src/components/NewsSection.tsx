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

  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{currentCategory}</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryNews.slice(0, 4).map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-0">
              {article.image_url && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>

                <h3
                  onClick={() => onArticleClick(article.id)}
                  className="text-base font-semibold mb-2 hover:text-primary cursor-pointer line-clamp-2"
                >
                  {article.title}
                </h3>

                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
    </div>
  );
}