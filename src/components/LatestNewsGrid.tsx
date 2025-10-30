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
    
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&mdash;/g, '-');
    text = text.replace(/&ndash;/g, '-');
    text = text.replace(/&rsquo;/g, "'");
    text = text.replace(/&lsquo;/g, "'");
    text = text.replace(/&rdquo;/g, '"');
    text = text.replace(/&ldquo;/g, '"');
    text = text.replace(/&hellip;/g, '...');
    
    const tmp = document.createElement('div');
    tmp.innerHTML = text;
    text = tmp.textContent || tmp.innerText || '';
    
    text = text.replace(/[\u00a0\u202f\u2009\u2000-\u200b]/g, ' ');
    text = text.replace(/[\u2011-\u2015]/g, '-');
    text = text.replace(/[\u2018\u2019]/g, "'");
    text = text.replace(/[\u201c\u201d]/g, '"');
    text = text.replace(/\s+/g, ' ');
    
    return text.trim();
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold font-serif text-foreground">Последние новости</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayNews.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            onClick={() => onNewsClick(item.id)}
          >
            <div className="relative h-56 overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Icon name="FileText" size={48} className="text-primary/30" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-white font-bold px-3 py-1 text-xs uppercase shadow-lg">
                  {item.category}
                </Badge>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {stripHtml(item.excerpt || item.content)}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(item.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Heart" size={14} />
                  <span>{item.likes || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};