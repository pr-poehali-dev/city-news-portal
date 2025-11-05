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

  const categoryIcons: { [key: string]: string } = {
    'Политика': 'Flag',
    'Экономика': 'TrendingUp',
    'Культура': 'Palette',
    'Спорт': 'Trophy',
    'События': 'Zap',
  };

  const categoryColors: { [key: string]: string } = {
    'Политика': '#000000',
    'Экономика': '#000000',
    'Культура': '#000000',
    'Спорт': '#000000',
    'События': '#000000',
  };

  const categoryAccents: { [key: string]: string } = {
    'Политика': '#FF4136',
    'Экономика': '#2ECC40',
    'Культура': '#B10DC9',
    'Спорт': '#FF851B',
    'События': '#0074D9',
  };

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-x-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        {categories.map((category, catIndex) => {
          const categoryNews = getCategoryNews(category);
          if (categoryNews.length === 0) return null;

          const bgColor = categoryColors[category] || '#000000';
          const accentColor = categoryAccents[category] || '#FF6B35';

          return (
            <div 
              key={category} 
              className={`relative border-b-4 border-primary ${
                catIndex % 2 === 0 ? 'md:border-r-4' : ''
              }`}
              style={{ backgroundColor: bgColor }}
            >
              <div 
                className="cursor-pointer px-4 md:px-8 py-8 md:py-12 hover:opacity-90 transition-opacity"
                onClick={() => onCategoryClick(category)}
              >
                <div className="flex items-start justify-between mb-6 md:mb-8">
                  <div className="flex-1">
                    <div 
                      className="inline-block px-4 md:px-6 py-2 md:py-3 mb-3 md:mb-4 rotate-[-1deg] shadow-[4px_4px_0px_0px_rgba(255,107,53,1)] md:shadow-[6px_6px_0px_0px_rgba(255,107,53,1)]"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Icon name={categoryIcons[category] || 'Sparkles'} size={24} className="text-white md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-3 md:mb-4">
                      {category}
                    </h2>
                    <div className="h-2 w-24" style={{ backgroundColor: accentColor }}></div>
                  </div>
                  <Icon name="ArrowUpRight" size={40} className="text-white/60 mt-2" />
                </div>

                <div className="space-y-6">
                  {categoryNews.map((news, idx) => (
                    <div
                      key={news.id}
                      className="group/item cursor-pointer border-l-4 border-white/20 pl-4 hover:border-white transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNewsClick(news.id);
                      }}
                    >
                      <div className="flex gap-4">
                        {news.image_url && (
                          <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-white/10">
                            <img
                              src={news.image_url}
                              alt={news.title}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-all duration-500"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-white font-black text-sm md:text-base leading-tight line-clamp-2 uppercase tracking-tighter group-hover/item:text-accent transition-colors">
                            {news.title}
                          </h4>
                          <p className="text-white/50 text-xs uppercase tracking-wider font-bold mt-2">
                            {new Date(news.created_at).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};