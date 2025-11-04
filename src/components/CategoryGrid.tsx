import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CategoryGridProps {
  categories: string[];
  articles: any[];
  onNewsClick: (newsId: number) => void;
  onCategoryClick: (category: string) => void;
}

export const CategoryGrid = ({ categories, articles, onNewsClick, onCategoryClick }: CategoryGridProps) => {
  const getCategoryNews = (category: string) => {
    return articles.filter(a => a.category === category).slice(0, 3);
  };

  const categoryColors: { [key: string]: string } = {
    'Политика': 'bg-blue-600',
    'Экономика': 'bg-green-600',
    'Культура': 'bg-purple-600',
    'Спорт': 'bg-red-600',
    'События': 'bg-orange-600',
  };

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold font-serif mb-8 text-foreground">Рубрики</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryNews = getCategoryNews(category);
          if (categoryNews.length === 0) return null;

          return (
            <Card key={category} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div 
                className={`${categoryColors[category] || 'bg-primary'} px-6 py-4 cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => onCategoryClick(category)}
              >
                <h3 className="text-white text-2xl font-bold font-serif flex items-center justify-between">
                  {category}
                  <Icon name="ChevronRight" size={24} className="text-white/80" />
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {categoryNews.map((news, idx) => (
                  <div
                    key={news.id}
                    className={`cursor-pointer group ${idx !== categoryNews.length - 1 ? 'border-b pb-3' : ''}`}
                    onClick={() => onNewsClick(news.id)}
                  >
                    <div className="flex gap-3">
                      {news.image_url && (
                        <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden rounded">
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Clock" size={12} />
                          <span>{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
