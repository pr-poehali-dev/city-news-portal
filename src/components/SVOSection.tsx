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
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-black px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              СВО
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-accent"></div>
          </div>
          <Icon name="Shield" size={48} className="text-accent/30 flex-shrink-0 md:w-16 md:h-16" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b-4 border-primary p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6 min-w-0">
            <img 
              src="https://cdn.poehali.dev/files/d026eb1a-861f-4069-8904-d64ffe4aa1e7.jpg" 
              alt="Фонд поддержки участников СВО"
              className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-4 border-primary"
            />
            <div className="min-w-0">
              <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight mb-1 md:mb-2">Помочь нашим</h3>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                Благотворительный фонд поддержки участников СВО
              </p>
            </div>
          </div>
          <a 
            href="https://fond-npusvo.ru/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 md:px-8 py-3 md:py-4 bg-accent hover:bg-accent/90 text-white font-black uppercase text-sm md:text-base transition-all border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 whitespace-nowrap flex items-center gap-2 flex-shrink-0"
          >
            <Icon name="Heart" size={18} />
            Помочь
          </a>
        </div>
      </div>

      {!mainNews && (
        <div className="text-center py-12 bg-white border-b-4 border-primary">
          <Icon name="Shield" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg font-bold uppercase">В данном разделе пока нет публикаций</p>
        </div>
      )}

      {mainNews && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <Card 
            className="md:col-span-2 group relative cursor-pointer overflow-hidden bg-white border-b-4 md:border-b-0 md:border-r-4 border-primary transition-all hover:z-10 rounded-none"
            onClick={() => onNewsClick(mainNews.id)}
          >
            <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-black">
              {mainNews.image_url ? (
                <img
                  src={mainNews.image_url}
                  alt={mainNews.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <Icon name="Shield" size={80} className="text-accent" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="absolute top-3 left-3 md:top-6 md:left-6">
                <div className="bg-accent px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                    <Icon name="AlertCircle" size={14} className="inline mr-2" />
                    Важно
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-12">
                <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter mb-2 md:mb-3 group-hover:text-accent transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)] line-clamp-2">
                  {mainNews.title}
                </h3>
                
                <div className="flex items-center gap-2 md:gap-4 text-white/60 text-[10px] md:text-xs uppercase tracking-wider font-bold flex-wrap">
                  <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  <span className="truncate max-w-[120px] md:max-w-none">{mainNews.author_name}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="md:col-span-1 flex flex-col gap-0">
            {sideNews.slice(0, 2).map((item, index) => (
              <Card
                key={item.id}
                className={`group relative cursor-pointer overflow-hidden bg-white transition-all hover:z-10 rounded-none ${
                  index === 0 ? 'border-b-4 border-primary' : ''
                }`}
                onClick={() => onNewsClick(item.id)}
              >
                <div className="aspect-[16/9] md:aspect-[4/3] relative overflow-hidden bg-black">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Shield" size={48} className="text-accent" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h4 className="text-white text-lg md:text-xl font-black uppercase leading-tight tracking-tighter line-clamp-2 group-hover:text-accent transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
