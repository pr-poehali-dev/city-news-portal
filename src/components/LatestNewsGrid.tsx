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
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-accent px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              СЕЙЧАС
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-white"></div>
          </div>
          <Icon name="Zap" size={48} className="text-white/30 flex-shrink-0 md:w-16 md:h-16" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {displayNews.map((item, index) => {
          const isLarge = index === 0;
          const accentColors = ['#FF4136', '#2ECC40', '#B10DC9', '#FF851B', '#0074D9'];
          const itemAccent = accentColors[index % accentColors.length];
          
          return (
            <article
              key={item.id}
              className={`group relative cursor-pointer overflow-hidden bg-white border-b-4 border-primary transition-all hover:z-10 ${
                isLarge ? 'md:col-span-3 md:row-span-1' : 'md:border-r-4 last:border-r-0'
              }`}
              onClick={() => onNewsClick(item.id)}
            >
              <div className={`${isLarge ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/3]'} relative overflow-hidden bg-black`}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon name="FileText" size={64} className="text-gray-400" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              </div>
              
              <div className="absolute top-3 left-3 md:top-6 md:left-6">
                <div 
                  className="px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: itemAccent }}
                >
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 ${isLarge ? 'lg:p-12' : ''}`}>
                <h3 className={`text-white font-black leading-[1.2] mb-2 md:mb-3 group-hover:text-accent transition-colors ${
                  isLarge ? 'text-base md:text-lg line-clamp-3' : 'text-base md:text-lg line-clamp-3'
                }`}>
                  {item.title}
                </h3>
                
                {isLarge && (
                  <p className="text-white/80 text-sm md:text-lg mb-3 md:mb-4 line-clamp-2 max-w-4xl hidden md:block">
                    {stripHtml(item.excerpt || item.content)}
                  </p>
                )}
                
                <div className="flex items-center gap-2 md:gap-4 text-white/60 text-[10px] md:text-xs uppercase tracking-wider font-bold flex-wrap">
                  <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  <span className="truncate max-w-[120px] md:max-w-none">{item.author_name || 'Редакция'}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};