import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';

interface CategoryGridProps {
  categories: string[];
  articles: any[];
  onNewsClick: (newsId: number) => void;
  onCategoryClick: (category: string) => void;
}

export const CategoryGrid = ({ categories, articles, onNewsClick, onCategoryClick }: CategoryGridProps) => {
  const getCategoryNews = (category: string) => {
    return articles.filter(a => a.category === category).slice(0, 1);
  };

  const categoryIcons: { [key: string]: string } = {
    'Политика': 'Landmark',
    'Экономика': 'TrendingUp',
    'Культура': 'Palette',
    'Спорт': 'Trophy',
    'События': 'Zap',
  };

  const categoryColors: { [key: string]: string } = {
    'Политика': 'from-red-600 to-pink-600',
    'Экономика': 'from-green-600 to-emerald-600',
    'Культура': 'from-purple-600 to-violet-600',
    'Спорт': 'from-orange-600 to-amber-600',
    'События': 'from-blue-600 to-cyan-600',
  };

  return (
    <section className="py-32 px-6 lg:px-20 bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20">
          <h2 className="text-6xl lg:text-8xl font-black mb-6 tracking-tight">
            Рубрики
          </h2>
          <p className="text-gray-500 text-2xl font-light">
            Все новости по категориям
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((category) => {
            const categoryNews = getCategoryNews(category);
            if (categoryNews.length === 0) return null;

            const news = categoryNews[0];
            const gradient = categoryColors[category] || 'from-gray-600 to-gray-800';

            return (
              <MagneticCard
                key={category}
                onClick={() => onCategoryClick(category)}
                className="cursor-pointer"
              >
                <div className="group relative overflow-hidden rounded-3xl h-[600px]">
                  {news.image_url ? (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  
                  <div className="absolute top-8 left-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-2xl`}>
                      <Icon name={categoryIcons[category] || 'Sparkles'} size={32} className="text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-5xl font-black mb-4 tracking-tight">
                      {category}
                    </h3>
                    
                    <p className="text-white/80 text-lg font-light mb-6 line-clamp-2">
                      {news.title}
                    </p>
                    
                    <div className="flex items-center gap-3 text-white/60">
                      <span className="text-sm font-medium">Смотреть все</span>
                      <Icon name="ArrowRight" size={20} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </MagneticCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
