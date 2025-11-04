import { Card } from '@/components/ui/card';
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
    <section className="mb-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold font-serif text-foreground mb-2">Последние новости</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayNews.map((item, index) => {
          const isLarge = index === 0;
          
          return (
            <Card
              key={item.id}
              className={`group relative overflow-hidden cursor-pointer border-0 bg-card rounded-3xl
                transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 
                ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                hover:-translate-y-2`}
              onClick={() => onNewsClick(item.id)}
            >
              <div className={`relative overflow-hidden ${isLarge ? 'h-96' : 'h-64'}`}>
                {item.image_url ? (
                  <>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                    <Icon name="Newspaper" size={isLarge ? 80 : 56} className="text-primary/40 relative z-10" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-primary/95 backdrop-blur-sm text-white font-bold px-4 py-1.5 text-xs uppercase shadow-xl border-0 rounded-full">
                    {item.category}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h3 className={`font-bold leading-tight mb-2 line-clamp-2 ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                    {item.title}
                  </h3>
                  {isLarge && (
                    <p className="text-white/90 text-base mb-4 line-clamp-2">
                      {stripHtml(item.excerpt || item.content)}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="Eye" size={14} />
                      <span>{item.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none"></div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
