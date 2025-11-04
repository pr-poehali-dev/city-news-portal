import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SVOSectionProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

const handleShare = (newsId: number, title: string, e: React.MouseEvent) => {
  e.stopPropagation();
  const url = `${window.location.origin}/news/${newsId}`;
  
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована в буфер обмена');
  }
};

export const SVOSection = ({ news, onNewsClick }: SVOSectionProps) => {
  const mainNews = news && news.length > 0 ? news[0] : null;
  const sideNews = news && news.length > 1 ? news.slice(1) : [];

  return (
    <section className="mb-16 px-6">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-blue-600 rounded-full blur-xl opacity-75"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-white to-blue-600 flex items-center justify-center shadow-2xl">
                <Icon name="Shield" size={36} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-2">
                СВО
              </h2>
              <p className="text-white/60 font-semibold">Специальная военная операция</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900/30 via-blue-900/30 to-red-900/30 border-2 border-white/10 rounded-[2rem] p-8 mb-10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <img 
                  src="https://cdn.poehali.dev/files/d026eb1a-861f-4069-8904-d64ffe4aa1e7.jpg" 
                  alt="Фонд поддержки участников СВО"
                  className="w-20 h-20 rounded-2xl border-3 border-white/20 shadow-2xl"
                />
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2 flex items-center gap-3">
                    <Icon name="Heart" size={24} className="text-red-400 animate-pulse" />
                    Помочь нашим
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                    Благотворительный фонд поддержки участников СВО
                  </p>
                </div>
              </div>
              <a 
                href="https://fond-npusvo.ru/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-110 whitespace-nowrap flex items-center gap-3"
              >
                <Icon name="Heart" size={20} className="animate-pulse" />
                Помочь
              </a>
            </div>
          </div>

          {!mainNews && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Shield" size={48} className="text-white/20" />
              </div>
              <p className="text-white/60 text-xl font-semibold">В данном разделе пока нет публикаций</p>
            </div>
          )}

          {mainNews && (
            <>
              <Card 
                className="group relative overflow-hidden cursor-pointer border-0 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-500 rounded-[2rem] shadow-2xl"
                onClick={() => onNewsClick(mainNews.id)}
              >
                <div className="relative h-[450px] overflow-hidden rounded-[2rem]">
                  {mainNews.image_url ? (
                    <img
                      src={mainNews.image_url}
                      alt={mainNews.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-950 via-slate-950 to-blue-950 flex items-center justify-center">
                      <Icon name="Shield" size={80} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                  
                  <Badge className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-5 py-2.5 text-sm rounded-full border-0 shadow-2xl shadow-red-500/50 z-10">
                    <Icon name="AlertCircle" size={16} className="mr-2" />
                    Важно
                  </Badge>

                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <h3 className="text-white text-3xl lg:text-4xl font-display font-black mb-4 leading-tight drop-shadow-2xl">
                      {mainNews.title}
                    </h3>
                    <div className="flex items-center gap-6 text-white/70 text-sm font-semibold">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <Icon name="User" size={14} />
                        <span>{mainNews.author_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {sideNews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {sideNews.map((item) => (
                    <Card
                      key={item.id}
                      className="group cursor-pointer border-0 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-500 overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl"
                      onClick={() => onNewsClick(item.id)}
                    >
                      {item.image_url && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                        </div>
                      )}
                      <div className="p-6">
                        <h4 className="text-white font-bold text-base mb-3 leading-tight group-hover:text-red-400 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-white/50 text-xs font-semibold">
                          <Icon name="Calendar" size={12} />
                          <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
