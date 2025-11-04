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
    <section className="min-h-screen flex items-center justify-center px-4 lg:px-20 py-20">
      <div className="max-w-[1600px] w-full">
        <div 
          className="group cursor-pointer relative"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="relative overflow-hidden rounded-3xl">
            <div className="aspect-[21/9] relative">
              <img
                src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                alt={mainNews.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-white/90 text-sm font-medium tracking-wide uppercase">
                  {mainNews.category}
                </span>
              </div>
              
              <h1 className="text-white text-4xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                {mainNews.title}
              </h1>
              
              <p className="text-white/80 text-lg lg:text-2xl mb-8 leading-relaxed font-light">
                {stripHtml(mainNews.excerpt || mainNews.content).slice(0, 180)}...
              </p>
              
              <div className="flex items-center gap-6 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/40"></div>
                <div className="flex items-center gap-2">
                  <span>{mainNews.author_name}</span>
                </div>
                <div className="ml-auto hidden lg:flex items-center gap-2 text-white/80 group-hover:gap-3 transition-all">
                  <span className="font-medium">Читать далее</span>
                  <Icon name="ArrowRight" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {sideNews.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sideNews.slice(0, 3).map((news) => (
              <div
                key={news.id}
                className="group cursor-pointer"
                onClick={() => onNewsClick(news.id)}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10]">
                  {news.image_url ? (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Icon name="Image" size={48} className="text-gray-300" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {news.category}
                  </span>
                  
                  <h3 className="text-xl font-bold leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500">
                    {new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
