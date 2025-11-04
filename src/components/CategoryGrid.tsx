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

  const categoryColors: { [key: string]: string } = {
    'Политика': 'bg-blue-600',
    'Экономика': 'bg-emerald-600',
    'Культура': 'bg-purple-600',
    'Спорт': 'bg-red-600',
    'События': 'bg-amber-600',
  };

  return (
    <section className="mb-20">
      <div className="mb-12">
        <h2 className="text-5xl lg:text-6xl font-black mb-2 tracking-tight">РУБРИКИ</h2>
        <div className="h-1 w-32 bg-accent"></div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
        {categories.map((category) => {
          const categoryNews = getCategoryNews(category);
          if (categoryNews.length === 0) return null;

          return (
            <div key={category} className="group bg-background overflow-hidden hover:scale-[1.02] transition-transform">
              <div 
                className={`${categoryColors[category] || 'bg-accent'} px-6 py-8 cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => onCategoryClick(category)}
              >
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Icon name={categoryIcons[category] || 'Sparkles'} size={32} className="text-white" />
                    <h3 className="text-3xl font-black tracking-tight uppercase">
                      {category}
                    </h3>
                  </div>
                  <Icon name="ArrowRight" size={28} className="text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                {categoryNews.map((news, idx) => (
                  <div
                    key={news.id}
                    className={`cursor-pointer group/item ${idx !== categoryNews.length - 1 ? 'border-b-2 border-border pb-4' : ''}`}
                    onClick={() => onNewsClick(news.id)}
                  >
                    <div className="flex gap-4 items-start">
                      {news.image_url && (
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-black">
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover/item:scale-110 group-hover/item:opacity-80 transition-all duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-base leading-tight line-clamp-2 group-hover/item:underline mb-2 tracking-tight">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
                          <Icon name="Calendar" size={12} />
                          <span>{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};