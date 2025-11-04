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
    <section className="mb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Main news - Full width on mobile, 2 cols on desktop */}
        <div 
          className="lg:col-span-2 relative group cursor-pointer overflow-hidden bg-black border-b-4 lg:border-b-0 lg:border-r-4 border-primary"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="h-[60vh] lg:h-[85vh] relative overflow-hidden">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
          
          <div className="absolute top-0 left-0 right-0 p-6 lg:p-12">
            <div className="inline-block bg-accent px-6 py-3 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-white font-black text-sm uppercase tracking-[0.3em]">
                {mainNews.category}
              </span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-12">
            <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-[0.9] md:leading-[0.85] tracking-tighter mb-3 md:mb-6 [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)] md:[text-shadow:_3px_3px_0_rgb(0_0_0_/_100%)]">
              {mainNews.title}
            </h1>
            
            <div className="flex items-center gap-2 md:gap-4 text-white text-[10px] md:text-xs uppercase tracking-widest font-bold flex-wrap">
              <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
              <span className="w-1 h-1 bg-accent rounded-full"></span>
              <span className="truncate max-w-[150px] md:max-w-none">{mainNews.author_name}</span>
            </div>
          </div>
        </div>

        {/* Side news stack */}
        <div className="lg:col-span-1 flex flex-col">
          {sideNews.slice(0, 2).map((news, index) => (
            <div
              key={news.id}
              className={`group relative cursor-pointer overflow-hidden bg-black ${
                index === 0 ? 'border-b-4 border-primary' : ''
              }`}
              onClick={() => onNewsClick(news.id)}
            >
              <div className="h-[40vh] lg:h-[42.5vh] relative overflow-hidden">
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                    <Icon name="Newspaper" size={64} className="text-accent" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              </div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="inline-block bg-white px-4 py-2 mb-4 w-fit">
                  <span className="text-black font-black text-xs uppercase tracking-[0.2em]">
                    {news.category}
                  </span>
                </div>
                
                <h3 className="text-white text-sm md:text-base font-black uppercase leading-tight line-clamp-2 tracking-tighter [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
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