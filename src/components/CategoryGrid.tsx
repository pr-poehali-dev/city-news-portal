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
    'Политика': 'from-red-600 via-red-500 to-pink-500',
    'Экономика': 'from-green-600 via-emerald-500 to-teal-500',
    'Культура': 'from-purple-600 via-violet-500 to-indigo-500',
    'Спорт': 'from-orange-600 via-orange-500 to-amber-500',
    'События': 'from-blue-600 via-blue-500 to-cyan-500',
  };

  const categoryBg: { [key: string]: string } = {
    'Политика': 'bg-red-50',
    'Экономика': 'bg-green-50',
    'Культура': 'bg-purple-50',
    'Спорт': 'bg-orange-50',
    'События': 'bg-blue-50',
  };

  return (
    <section className="mb-16 px-6">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform">
            <Icon name="Grid3x3" size={28} className="text-white" />
          </div>
          <h2 className="text-5xl lg:text-6xl font-display font-black bg-gradient-to-r from-accent via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Рубрики
          </h2>
        </div>
        <p className="text-gray-600 text-lg">Выберите интересующую тему</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryNews = getCategoryNews(category);
          if (categoryNews.length === 0) return null;

          const gradient = categoryGradients[category] || 'from-primary to-accent';
          const bgColor = categoryBg[category] || 'bg-gray-50';

          return (
            <div 
              key={category} 
              className={`group relative overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 ${bgColor}`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-[2rem] opacity-50 blur-xl group-hover:opacity-100 transition-opacity`}></div>
              <div 
                className={`relative cursor-pointer p-8 bg-gradient-to-br ${gradient} hover:scale-[1.02] transition-all duration-500 rounded-t-[2rem]`}
                onClick={() => onCategoryClick(category)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Icon name={categoryIcons[category] || 'Sparkles'} size={32} className="text-white" />
                  </div>
                  <Icon name="ArrowUpRight" size={28} className="text-white/60 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </div>
                <h3 className="text-4xl font-display font-black text-white mb-2">
                  {category}
                </h3>
                <div className="h-1 w-20 bg-white/40 rounded-full"></div>
              </div>

              <div className="relative bg-white p-6 space-y-4 rounded-b-[2rem]">
                {categoryNews.map((news, idx) => (
                  <div
                    key={news.id}
                    className={`group/item cursor-pointer pb-4 ${idx !== categoryNews.length - 1 ? 'border-b-2 border-gray-100' : ''}`}
                    onClick={() => onNewsClick(news.id)}
                  >
                    <div className="flex gap-4">
                      {news.image_url && (
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
                          <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover/item:opacity-75 blur transition-opacity`}></div>
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="relative w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-base leading-snug line-clamp-2 group-hover/item:text-accent transition-colors mb-2">
                          {news.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                          <Icon name="Clock" size={12} />
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