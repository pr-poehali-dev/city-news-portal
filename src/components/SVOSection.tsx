import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';

interface SVOSectionProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const SVOSection = ({ news, onNewsClick }: SVOSectionProps) => {
  const mainNews = news && news.length > 0 ? news[0] : null;
  const sideNews = news && news.length > 1 ? news.slice(1, 4) : [];

  return (
    <section className="py-32 px-6 lg:px-20 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
              <Icon name="Shield" size={32} className="text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-6xl lg:text-8xl font-black tracking-tight">
                СВО
              </h2>
              <p className="text-gray-400 text-xl font-light mt-2">
                Специальная военная операция
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <img 
                src="https://cdn.poehali.dev/files/d026eb1a-861f-4069-8904-d64ffe4aa1e7.jpg" 
                alt="Фонд поддержки участников СВО"
                className="w-20 h-20 rounded-2xl"
              />
              <div>
                <h3 className="text-white font-bold text-2xl mb-2 flex items-center gap-3">
                  <Icon name="Heart" size={24} className="text-red-500" />
                  Помочь нашим
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-xl">
                  Благотворительный фонд поддержки участников СВО
                </p>
              </div>
            </div>
            <a 
              href="https://fond-npusvo.ru/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-2xl transition-all"
            >
              Помочь
            </a>
          </div>
        </div>

        {!mainNews && (
          <div className="text-center py-20">
            <Icon name="Shield" size={64} className="text-gray-800 mx-auto mb-6" />
            <p className="text-gray-500 text-xl">В данном разделе пока нет публикаций</p>
          </div>
        )}

        {mainNews && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <MagneticCard
              onClick={() => onNewsClick(mainNews.id)}
              className="cursor-pointer"
            >
              <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group">
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={mainNews.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 bg-red-600 px-4 py-2 rounded-full">
                    <span className="text-white font-bold text-sm">Важно</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-white text-3xl font-bold mb-4 leading-tight line-clamp-3">
                    {mainNews.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={14} />
                      <span>{mainNews.author_name}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </MagneticCard>

            <div className="space-y-6">
              {sideNews.map((item) => (
                <MagneticCard
                  key={item.id}
                  onClick={() => onNewsClick(item.id)}
                  className="cursor-pointer"
                >
                  <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:border-white/20 transition-colors">
                    <div className="flex gap-4">
                      {item.image_url && (
                        <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-base leading-tight mb-2 group-hover:text-gray-300 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </MagneticCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
