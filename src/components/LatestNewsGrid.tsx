import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LatestNewsGridProps {
  news: any[];
  onNewsClick: (newsId: number) => void;
  limit?: number;
}

export const LatestNewsGrid = ({ news, onNewsClick, limit = 6 }: LatestNewsGridProps) => {
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
    <section className="mb-20">
      <div className="mb-12">
        <h2 className="text-5xl lg:text-6xl font-black mb-2 tracking-tight">ПОСЛЕДНИЕ НОВОСТИ</h2>
        <div className="h-1 w-32 bg-accent"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {displayNews.map((item) => (
          <article
            key={item.id}
            className="group relative bg-background cursor-pointer overflow-hidden transition-all duration-300 hover:z-10 hover:scale-[1.02]"
            onClick={() => onNewsClick(item.id)}
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-black">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Icon name="FileText" size={48} className="text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <Badge className="bg-accent text-white font-black px-3 py-1 text-xs uppercase tracking-widest border-0">
                  {item.category}
                </Badge>
              </div>
            </div>
            
            <div className="p-6 bg-background">
              <h3 className="font-black text-xl mb-3 leading-tight line-clamp-2 tracking-tight group-hover:underline">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                {stripHtml(item.excerpt || item.content)}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-bold">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Eye" size={14} />
                  <span>{item.views || 0}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};