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
    <section className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div 
          className="lg:col-span-8 group cursor-pointer relative overflow-hidden rounded-3xl"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
          
          <div className="aspect-[16/9] lg:aspect-[16/10] relative overflow-hidden">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          </div>
          
          <div className="absolute top-6 left-6 z-20">
            <Badge className="bg-gradient-to-r from-accent to-purple-600 text-white font-semibold px-4 py-2 text-xs rounded-full shadow-lg shadow-accent/50 border-0">
              {mainNews.category}
            </Badge>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 z-20">
            <h1 className="text-white text-3xl lg:text-5xl font-display font-bold mb-4 leading-tight">
              {mainNews.title}
            </h1>
            
            <p className="text-white/80 text-base lg:text-lg mb-6 line-clamp-2 max-w-3xl leading-relaxed">
              {stripHtml(mainNews.excerpt || mainNews.content)}
            </p>
            
            <div className="flex items-center gap-6 text-white/60 text-sm font-medium">
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

        <div className="lg:col-span-4 flex flex-col gap-6">
          {sideNews.slice(0, 2).map((news, index) => (
            <div
              key={news.id}
              className="group relative cursor-pointer overflow-hidden rounded-3xl flex-1"
              onClick={() => onNewsClick(news.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              
              <div className="h-full relative overflow-hidden">
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Icon name="Newspaper" size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                <Badge className="bg-gradient-to-r from-accent to-purple-600 text-white font-semibold px-3 py-1.5 text-xs rounded-full shadow-lg shadow-accent/50 border-0 mb-3 w-fit">
                  {news.category}
                </Badge>
                
                <h3 className="text-white text-xl lg:text-2xl font-display font-bold leading-tight line-clamp-3">
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