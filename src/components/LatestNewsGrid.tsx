import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 9 }: LatestNewsGridProps) => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white">
        {displayNews.map((item, index) => {
          
          return (
            <article
              key={item.id}
              className="group cursor-pointer overflow-hidden bg-white border-b-4 md:border-r-4 last:md:border-r-0 border-primary transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:z-10"
              onClick={() => onNewsClick(item.id)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon name="FileText" size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3">
                  <div className="inline-block px-3 py-1.5 bg-primary border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-white font-black text-xs uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                <h3 className="text-foreground font-black uppercase leading-[1.1] tracking-tight mb-2 text-base md:text-lg line-clamp-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider font-bold mt-3">
                  <Icon name="Clock" size={12} />
                  <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  <span className="truncate">{item.author_name || 'Редакция'}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};