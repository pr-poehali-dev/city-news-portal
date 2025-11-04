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
    <section className="mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 -z-10"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        <div 
          className="lg:col-span-8 group cursor-pointer relative overflow-hidden rounded-[2.5rem] shadow-2xl"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-orange-500 rounded-[2.5rem] opacity-75 blur group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-[2.5rem]">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>
          
          <div className="absolute top-8 left-8 z-20">
            <Badge className="bg-gradient-to-r from-accent to-orange-500 text-white font-bold px-5 py-2.5 text-sm rounded-full shadow-2xl shadow-accent/50 border-0 animate-pulse">
              <Icon name="TrendingUp" size={14} className="mr-2" />
              {mainNews.category}
            </Badge>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-20">
            <h1 className="text-white text-3xl lg:text-6xl font-display font-black mb-4 leading-tight drop-shadow-2xl">
              {mainNews.title}
            </h1>
            
            <p className="text-white/90 text-base lg:text-xl mb-6 line-clamp-2 max-w-3xl leading-relaxed drop-shadow-lg">
              {stripHtml(mainNews.excerpt || mainNews.content)}
            </p>
            
            <div className="flex items-center gap-6 text-white/80 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Icon name="Calendar" size={16} />
                <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Icon name="User" size={16} />
                <span>{mainNews.author_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {sideNews.slice(0, 2).map((news, index) => {
            const gradients = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500'
            ];
            return (
              <div
                key={news.id}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] flex-1 shadow-xl hover:shadow-2xl transition-all duration-500"
                onClick={() => onNewsClick(news.id)}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${gradients[index]} rounded-[2rem] opacity-50 blur group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative h-full overflow-hidden rounded-[2rem]">
                  {news.image_url ? (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradients[index]} flex items-center justify-center`}>
                      <Icon name="Newspaper" size={48} className="text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                  <Badge className={`bg-gradient-to-r ${gradients[index]} text-white font-bold px-4 py-2 text-xs rounded-full shadow-lg border-0 mb-3 w-fit`}>
                    {news.category}
                  </Badge>
                  
                  <h3 className="text-white text-xl lg:text-2xl font-display font-bold leading-tight line-clamp-3 drop-shadow-lg">
                    {news.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
