import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 10 }: LatestNewsGridProps) => {
  const displayNews = news.slice(0, limit);

  const stripHtml = (html: string) => {
    if (!html) return '';
    
    let text = html;
    
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&ndash;/gi, '-');
    text = text.replace(/&rsquo;/gi, "'");
    text = text.replace(/&lsquo;/gi, "'");
    text = text.replace(/&rdquo;/gi, '"');
    text = text.replace(/&ldquo;/gi, '"');
    text = text.replace(/&hellip;/gi, '...');
    text = text.replace(/&[a-z]+;/gi, ' ');
    
    text = text.replace(/[\u00a0\u202f\u2009\u2000-\u200b]/g, ' ');
    text = text.replace(/[\u2011-\u2015]/g, '-');
    text = text.replace(/[\u2018\u2019]/g, "'");
    text = text.replace(/[\u201c\u201d]/g, '"');
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  };

  return (
    <section className="mb-12 md:mb-16 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-primary px-6 md:px-12 py-12 md:py-16 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-4 md:mb-6">
              СЕЙЧАС
            </h2>
            <div className="h-2 md:h-3 w-24 md:w-40 bg-accent"></div>
          </div>
          <Icon name="Zap" size={48} className="text-white/20 flex-shrink-0 md:w-20 md:h-20" />
        </div>
      </div>
      
      <div className="bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
          {displayNews.map((item, index) => {
            const hasDescription = index % 3 === 0;
            const isLarge = index === 0 || index === 5;
            
            return (
              <article
                key={item.id}
                className={`group cursor-pointer overflow-hidden bg-white border-b-4 border-r-4 ${
                  isLarge ? 'md:col-span-2' : ''
                } last:border-r-0 md:last:border-r-4 md:[&:nth-child(5n)]:border-r-0 lg:[&:nth-child(5n)]:border-r-0 border-primary transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:z-10`}
                onClick={() => onNewsClick(item.id)}
              >
                <div className={`${isLarge ? 'aspect-[16/9]' : 'aspect-square'} relative overflow-hidden bg-black`}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Icon name="FileText" size={32} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  
                  <div className="absolute top-2 left-2">
                    <div className="inline-block px-2 py-1 bg-primary">
                      <span className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className={`text-white font-black uppercase leading-[1.1] tracking-tight ${
                      isLarge ? 'text-sm md:text-base line-clamp-2' : 'text-xs md:text-sm line-clamp-3'
                    } group-hover:text-accent transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]`}>
                      {item.title}
                    </h3>
                    
                    {hasDescription && (
                      <p className="text-white/70 text-[10px] md:text-xs line-clamp-1 mt-1 hidden md:block">
                        {stripHtml(item.excerpt || item.content)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-white/80 text-[9px] uppercase tracking-wider font-bold mt-2">
                      <Icon name="Clock" size={10} />
                      <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
