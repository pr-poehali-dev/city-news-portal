import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SVOSectionProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const SVOSection = ({ news, onNewsClick }: SVOSectionProps) => {
  const displayNews = news && news.length > 0 ? news.slice(0, 4) : [];

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-black px-4 md:px-8 py-6 md:py-8 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-2 md:mb-3">
              СВО
            </h2>
            <div className="h-1 w-16 md:w-24 bg-accent"></div>
          </div>
          <Icon name="Shield" size={32} className="text-accent/30 flex-shrink-0 md:w-12 md:h-12" />
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
              <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-1">Помочь нашим</h3>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                Благотворительный фонд поддержки участников СВО
              </p>
            </div>
          </div>
          <a 
            href="https://fond-npusvo.ru/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 md:px-8 py-3 bg-accent hover:bg-accent/90 text-white font-black uppercase text-sm md:text-base transition-all border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 whitespace-nowrap flex items-center gap-2 flex-shrink-0"
          >
            <Icon name="Heart" size={18} />
            Помочь
          </a>
        </div>
      </div>

      {displayNews.length === 0 && (
        <div className="text-center py-12 bg-white border-b-4 border-primary">
          <Icon name="Shield" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg font-bold uppercase">В данном разделе пока нет публикаций</p>
        </div>
      )}

      {displayNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {displayNews.map((item, index) => (
            <Card
              key={item.id}
              className={`group relative cursor-pointer overflow-hidden bg-white border-b-4 ${
                index < displayNews.length - 1 ? 'md:border-r-4' : ''
              } ${index === 2 ? 'lg:border-r-4' : ''} border-primary transition-all hover:z-10 rounded-none`}
              onClick={() => onNewsClick(item.id)}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-black">
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
                
                <div className="absolute top-3 left-3">
                  <div className="bg-accent px-3 py-1.5 border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-white font-black text-[10px] uppercase tracking-wider">
                      <Icon name="AlertCircle" size={12} className="inline mr-1" />
                      Важно
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black via-black/95 to-transparent">
                  <h4 className="text-white text-base md:text-lg font-black leading-[1.2] line-clamp-3 group-hover:text-accent transition-colors">
                    {item.title}
                  </h4>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};