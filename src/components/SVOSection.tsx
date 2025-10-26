import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SVOSectionProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const SVOSection = ({ news, onNewsClick }: SVOSectionProps) => {
  if (!news || news.length === 0) return null;

  const mainNews = news[0];
  const sideNews = news.slice(1, 4);

  return (
    <section className="mb-16 bg-gradient-to-b from-slate-900 to-slate-800 -mx-6 px-6 py-12 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-12 bg-red-700"></div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider font-serif flex items-center gap-3">
            <Icon name="Shield" size={32} className="text-red-700" />
            Специальная военная операция
          </h2>
          <div className="h-1 flex-1 bg-red-700"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card 
              className="group relative overflow-hidden cursor-pointer border-2 border-red-900/30 bg-slate-950 hover:border-red-700 transition-all duration-300"
              onClick={() => onNewsClick(mainNews.id)}
            >
              <div className="relative h-[450px] overflow-hidden">
                {mainNews.image_url ? (
                  <img
                    src={mainNews.image_url}
                    alt={mainNews.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-950 to-slate-950 flex items-center justify-center">
                    <Icon name="Shield" size={80} className="text-red-700/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-700 text-white font-bold px-4 py-2 text-sm uppercase tracking-widest border-2 border-red-500">
                    <Icon name="AlertCircle" size={14} className="mr-2" />
                    Важно
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-white text-3xl font-bold font-serif mb-4 leading-tight">
                    {mainNews.title}
                  </h3>
                  <p className="text-gray-300 text-base mb-4 line-clamp-2">
                    {mainNews.content || mainNews.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} />
                      <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} />
                      <span>{mainNews.author_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {sideNews.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer border-2 border-slate-700 bg-slate-900 hover:border-red-700 hover:bg-slate-800 transition-all duration-300"
                onClick={() => onNewsClick(item.id)}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-700 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-base mb-2 leading-tight group-hover:text-red-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-4 text-gray-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Eye" size={12} />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {news.length > 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/#СВО'}
              className="px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold uppercase tracking-wider transition-colors border-2 border-red-500"
            >
              Все материалы СВО
              <Icon name="ArrowRight" size={16} className="inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
