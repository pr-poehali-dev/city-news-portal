import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

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

  const categoryGradients: { [key: string]: string } = {
    'Политика': 'from-red-500 to-pink-600',
    'Экономика': 'from-green-500 to-emerald-600',
    'Культура': 'from-purple-500 to-indigo-600',
    'Спорт': 'from-orange-500 to-amber-600',
    'События': 'from-blue-500 to-cyan-600',
  };

  return (
    <section className="mb-16">
      <div className="mb-10">
        <div className="relative inline-block">
          <div className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
          <h2 className="relative text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-accent via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Рубрики
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryNews = getCategoryNews(category);
          if (categoryNews.length === 0) return null;

          const gradient = categoryGradients[category] || 'from-accent to-purple-600';

          return (
            <div 
              key={category} 
              className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div 
                className={`cursor-pointer p-8 bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-transform duration-500`}
                onClick={() => onCategoryClick(category)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Icon name={categoryIcons[category] || 'Sparkles'} size={28} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white">
                      {category}
                    </h3>
                  </div>
                  <Icon name="ArrowUpRight" size={24} className="text-white/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

              <div className="p-6 space-y-4">
                {categoryNews.map((news, idx) => (
                  <div
                    key={news.id}
                    className={`group/item cursor-pointer pb-4 ${idx !== categoryNews.length - 1 ? 'border-b border-gray-200' : ''}`}
                    onClick={() => onNewsClick(news.id)}
                  >
                    <div className="flex gap-4">
                      {news.image_url && (
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-2xl">
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover/item:text-accent transition-colors mb-2">
                          {news.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(news.created_at).toLocaleDateString('ru-RU')}
                        </p>
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
