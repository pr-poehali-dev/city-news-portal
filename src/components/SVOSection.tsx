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
    <section className="mb-16 bg-gradient-to-b from-slate-900 to-slate-800 -mx-6 px-6 py-12 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 border border-red-700/30 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center gap-3 text-white">
            <Icon name="Heart" size={20} className="text-red-500" />
            <span className="font-bold text-lg uppercase tracking-wide">Мы поддерживаем наших</span>
            <Icon name="Heart" size={20} className="text-red-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 border-2 border-blue-600/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img 
                src="https://cdn.poehali.dev/files/d026eb1a-861f-4069-8904-d64ffe4aa1e7.jpg" 
                alt="Фонд поддержки участников СВО"
                className="w-20 h-20 rounded-xl border-2 border-white/30 shadow-lg"
              />
              <div>
                <h3 className="text-white font-bold text-2xl mb-2">Помочь нашим</h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                  Благотворительный фонд поддержки участников СВО. Помогаем бойцам на передовой необходимым снаряжением, техникой и гуманитарной помощью.
                </p>
              </div>
            </div>
            <a 
              href="https://fond-npusvo.ru/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 whitespace-nowrap flex items-center gap-2"
            >
              <Icon name="Heart" size={20} />
              Помочь
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-12 bg-red-700"></div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider font-serif flex items-center gap-3">
            <Icon name="Shield" size={32} className="text-red-700" />
            Специальная военная операция
          </h2>
          <div className="h-1 flex-1 bg-red-700"></div>
        </div>

        {!mainNews && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">В данном разделе пока нет публикаций</p>
            <p className="text-gray-500 text-sm mt-2">Материалы с тегом "СВО" будут отображаться здесь</p>
          </div>
        )}

        {mainNews && (
          <>
          <div className="mb-8">
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
                    {mainNews.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleShare(mainNews.id, mainNews.title, e)}
                      className="text-gray-400 hover:text-white hover:bg-red-700/20"
                    >
                      <Icon name="Share2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {sideNews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {sideNews.map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer border-2 border-slate-700 bg-slate-900 hover:border-red-700 hover:bg-slate-800 transition-all duration-300 overflow-hidden"
                  onClick={() => onNewsClick(item.id)}
                >
                  {item.image_url && (
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-white font-bold text-sm mb-2 leading-tight group-hover:text-red-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
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
    </section>
  );
};