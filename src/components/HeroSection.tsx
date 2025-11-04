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
    <section className="mb-24">
      <div className="grid grid-cols-12 gap-6">
        <div 
          className="col-span-12 lg:col-span-8 relative group cursor-pointer overflow-hidden bg-black"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="aspect-[16/10] relative overflow-hidden">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <Badge className="mb-4 bg-accent text-white font-black px-4 py-1.5 text-xs uppercase tracking-widest border-0">
              {mainNews.category}
            </Badge>
            
            <h1 className="text-white text-4xl lg:text-6xl font-black font-serif mb-4 leading-[0.95] tracking-tight">
              {mainNews.title}
            </h1>
            
            <p className="text-white/80 text-lg mb-6 line-clamp-2 max-w-3xl leading-relaxed">
              {stripHtml(mainNews.excerpt || mainNews.content)}
            </p>
            
            <div className="flex items-center gap-6 text-white/60 text-sm uppercase tracking-wider font-bold">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="User" size={16} />
                <span>{mainNews.author_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {sideNews.slice(0, 2).map((news, index) => (
            <div
              key={news.id}
              className="group relative cursor-pointer overflow-hidden bg-black flex-1"
              onClick={() => onNewsClick(news.id)}
            >
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden">
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Icon name="Newspaper" size={48} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className="mb-3 bg-accent text-white font-black px-3 py-1 text-xs uppercase tracking-widest border-0">
                  {news.category}
                </Badge>
                
                <h3 className="text-white text-xl lg:text-2xl font-black font-serif leading-tight line-clamp-3 tracking-tight">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};