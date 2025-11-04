import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  mainNews: any;
  sideNews: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroSection = ({ mainNews, sideNews, onNewsClick }: HeroSectionProps) => {
  if (!mainNews) return null;

  const stripHtml = (html: string) => {
    if (!html) return '';
    let text = html;
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&ndash;/gi, '-');
    text = text.replace(/&[a-z]+;/gi, ' ');
    text = text.replace(/[\u00a0\u202f\u2009\u2000-\u200b]/g, ' ');
    text = text.replace(/[\u2011-\u2015]/g, '-');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  };

  return (
    <section className="mb-0 border-t-4 border-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {[mainNews, ...sideNews.slice(0, 2)].map((news, index) => (
          <article
            key={news.id}
            className="group cursor-pointer overflow-hidden bg-white border-b-4 border-r-4 border-primary transition-all hover:z-10 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onClick={() => onNewsClick(news.id)}
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-black">
              {news.image_url ? (
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Icon name="Newspaper" size={64} className="text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
            </div>
            
            <div className="p-4 md:p-5 min-h-[180px] flex flex-col">
              <div 
                className="inline-block px-3 py-1 mb-3 w-fit rotate-[-1deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: index === 0 ? '#FF4136' : index === 1 ? '#2ECC40' : '#B10DC9' }}
              >
                <span className="text-white font-black text-[10px] uppercase tracking-wider">
                  {news.category}
                </span>
              </div>
              
              <h3 className="text-foreground font-bold leading-tight mb-3 text-base md:text-lg group-hover:text-accent transition-colors flex-grow">
                {news.title}
              </h3>
              
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold">
                <span>{new Date(news.created_at).toLocaleDateString('ru-RU')}</span>
                <span className="w-1 h-1 bg-accent rounded-full"></span>
                <span className="truncate">{news.author_name || 'Редакция'}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};