import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CategoryGridProps {
  categories: string[];
  articles: any[];
  onNewsClick: (newsId: number) => void;
  onCategoryClick: (category: string) => void;
}

export const CategoryGrid = ({ categories, articles, onNewsClick, onCategoryClick }: CategoryGridProps) => {
  const getCategoryNews = (category: string) => {
    return articles.filter(a => a.category === category).slice(0, 4);
  };

  const categoryIcons: { [key: string]: string } = {
    'Политика': 'Flag',
    'Экономика': 'TrendingUp',
    'Культура': 'Palette',
    'Спорт': 'Trophy',
    'События': 'Zap',
  };

  const categoryGradients: { [key: string]: string } = {
    'Политика': 'from-blue-600 to-blue-400',
    'Экономика': 'from-emerald-600 to-emerald-400',
    'Культура': 'from-purple-600 to-purple-400',
    'Спорт': 'from-red-600 to-red-400',
    'События': 'from-amber-600 to-amber-400',
  };

  return (
    <section className="mb-20">
      <div className="mb-10">
        <h2 className="text-4xl font-bold font-serif text-foreground mb-2">По рубрикам</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {categories.map((category) => {
          const categoryNews = getCategoryNews(category);
          if (categoryNews.length === 0) return null;

          return (
            <Card key={category} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 bg-card rounded-3xl">
              <div 
                className={`bg-gradient-to-br ${categoryGradients[category] || 'from-primary to-accent'} px-8 py-6 cursor-pointer
                  hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
                onClick={() => onCategoryClick(category)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon name={categoryIcons[category] || 'Sparkles'} size={24} className="text-white" />
                    </div>
                    <h3 className="text-white text-2xl font-bold font-serif">
                      {category}
                    </h3>
                  </div>
                  <Icon name="ArrowRight" size={24} className="text-white/80 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {categoryNews.map((news, idx) => (
                  <div
                    key={news.id}
                    className={`cursor-pointer group/item ${idx !== categoryNews.length - 1 ? 'border-b border-border pb-4' : ''}`}
                    onClick={() => onNewsClick(news.id)}
                  >
                    <div className="flex gap-4 items-start">
                      {news.image_url && (
                        <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden rounded-2xl">
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base leading-snug line-clamp-2 group-hover/item:text-primary transition-colors mb-2">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Calendar" size={12} />
                          <span className="font-medium">{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
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
