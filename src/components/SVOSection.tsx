import Icon from '@/components/ui/icon';

interface SVOSectionProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
}

export const SVOSection = ({ news, onNewsClick }: SVOSectionProps) => {
  const displayNews = news && news.length > 0 ? news : [];

  return (
    <section className="mb-12 md:mb-16 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-primary px-6 md:px-12 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center gap-3">
          <Icon name="Shield" size={32} className="text-white flex-shrink-0 md:w-12 md:h-12" />
          <div className="min-w-0">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter">
              СВО
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-b-4 border-primary p-3 md:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <img 
              src="https://cdn.poehali.dev/files/d026eb1a-861f-4069-8904-d64ffe4aa1e7.jpg" 
              alt="Фонд поддержки участников СВО"
              className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 border-2 border-primary rounded"
            />
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-0.5">Помочь нашим</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">
                Фонд поддержки участников СВО
              </p>
            </div>
          </div>
          <a 
            href="https://fond-npusvo.ru/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 md:px-6 py-2 md:py-3 bg-accent hover:bg-accent/90 text-white font-black uppercase text-xs md:text-sm transition-all border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
          >
            <Icon name="Heart" size={14} />
            Помочь
          </a>
        </div>
      </div>

      {displayNews.length === 0 && (
        <div className="text-center py-8 bg-white border-b-4 border-primary">
          <Icon name="Shield" size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-sm font-bold uppercase">Пока нет публикаций</p>
        </div>
      )}

      {displayNews.length > 0 && (
        <>
          <div className="bg-white divide-y-2 divide-gray-200 border-b-4 border-primary">
            {displayNews.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="group cursor-pointer flex gap-3 p-4 hover:bg-accent/5 transition-colors"
                onClick={() => onNewsClick(item.id)}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative overflow-hidden bg-black rounded-lg">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                      <Icon name="Shield" size={24} className="text-accent" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="inline-block px-2 py-0.5 bg-accent w-fit mb-2">
                    <span className="text-white font-bold text-[9px] md:text-[10px] uppercase tracking-wide flex items-center gap-1">
                      <Icon name="AlertCircle" size={10} />
                      Важно
                    </span>
                  </div>
                  
                  <h4 className="text-foreground font-bold leading-tight mb-1 text-sm md:text-base line-clamp-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-muted-foreground text-[10px] md:text-xs line-clamp-1 leading-relaxed hidden md:block">
                    {item.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs mt-1">
                    <Icon name="Clock" size={12} />
                    <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {news && news.length > 6 && (
            <div className="bg-white border-b-4 border-primary p-6 text-center">
              <button
                onClick={() => window.location.href = '/svo'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-black uppercase text-sm transition-all border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
              >
                Все статьи СВО
                <Icon name="ArrowRight" size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};