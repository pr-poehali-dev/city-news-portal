import { Card } from '@/components/ui/card';
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
    <section className="mb-20 relative">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card 
          className="lg:col-span-2 group relative overflow-hidden cursor-pointer border-0 bg-card rounded-3xl
            shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.25)] transition-all duration-700 hover:-translate-y-2"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="relative h-[600px] overflow-hidden">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="absolute top-6 left-6">
              <Badge className="bg-primary/95 backdrop-blur-sm text-white font-bold px-5 py-2 text-sm uppercase tracking-wider shadow-2xl border-0 rounded-full">
                {mainNews.category}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h2 className="text-white text-5xl font-black font-serif mb-5 leading-tight drop-shadow-2xl">
                {mainNews.title}
              </h2>
              <p className="text-white/90 text-lg mb-6 line-clamp-3 drop-shadow-lg max-w-3xl">
                {stripHtml(mainNews.excerpt || mainNews.content)}
              </p>
              <div className="flex items-center gap-6 text-white/80 text-base">
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} />
                  <span className="font-medium">{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="User" size={18} />
                  <span className="font-medium">{mainNews.author_name}</span>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/20 group-hover:to-accent/10 transition-all duration-700 pointer-events-none"></div>
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          {sideNews.slice(0, 2).map((news, index) => (
            <Card
              key={news.id}
              className="group relative overflow-hidden cursor-pointer border-0 bg-card rounded-3xl
                shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2 flex-1"
              onClick={() => onNewsClick(news.id)}
            >
              <div className="relative h-full min-h-[280px] overflow-hidden">
                {news.image_url ? (
                  <>
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name="Newspaper" size={64} className="text-primary/30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/95 backdrop-blur-sm text-white font-bold px-4 py-1.5 text-xs uppercase shadow-xl border-0 rounded-full">
                    {news.category}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-bold font-serif leading-tight line-clamp-3 drop-shadow-lg">
                    {news.title}
                  </h3>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
