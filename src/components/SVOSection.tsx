import Icon from '@/components/ui/icon';

interface SVOSectionProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const SVOSection = ({ news, onNewsClick }: SVOSectionProps) => {
  const mainNews = news && news.length > 0 ? news[0] : null;
  const sideNews = news && news.length > 1 ? news.slice(1, 4) : [];

  return (
    <section className="py-20 px-4 lg:px-20 bg-black text-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              СВО
            </h2>
          </div>
          <p className="text-gray-400 text-lg">
            Специальная военная операция
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img 
                src="https://cdn.poehali.dev/files/d026eb1a-861f-4069-8904-d64ffe4aa1e7.jpg" 
                alt="Фонд поддержки участников СВО"
                className="w-16 h-16 rounded-xl"
              />
              <div>
                <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-2">
                  <Icon name="Heart" size={20} className="text-red-500" />
                  Помочь нашим
                </h3>
                <p className="text-gray-400 text-sm">
                  Благотворительный фонд поддержки участников СВО
                </p>
              </div>
            </div>
            <a 
              href="https://fond-npusvo.ru/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Помочь
            </a>
          </div>
        </div>

        {!mainNews && (
          <div className="text-center py-16">
            <Icon name="Shield" size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">В данном разделе пока нет публикаций</p>
          </div>
        )}

        {mainNews && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              className="group cursor-pointer"
              onClick={() => onNewsClick(mainNews.id)}
            >
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10]">
                {mainNews.image_url ? (
                  <img
                    src={mainNews.image_url}
                    alt={mainNews.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <Icon name="Shield" size={80} className="text-zinc-800" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Важно
                </span>
                
                <h3 className="text-2xl font-bold leading-tight group-hover:text-gray-300 transition-colors">
                  {mainNews.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                  <span>•</span>
                  <span>{mainNews.author_name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {sideNews.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer flex gap-4 pb-6 border-b border-zinc-800 last:border-0"
                  onClick={() => onNewsClick(item.id)}
                >
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
                    <h4 className="font-semibold text-base leading-tight mb-2 group-hover:text-gray-300 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
