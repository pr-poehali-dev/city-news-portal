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

  return (
    <section className="mb-12">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card 
          className="group relative overflow-hidden cursor-pointer border-0 shadow-2xl hover:shadow-3xl transition-all duration-300"
          onClick={() => onNewsClick(mainNews.id)}
        >
          <div className="relative h-[500px] overflow-hidden">
            <img
              src={mainNews.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
              alt={mainNews.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <Badge className="mb-3 bg-primary text-white font-bold px-4 py-1.5 text-sm uppercase tracking-wide">
                {mainNews.category}
              </Badge>
              <h2 className="text-white text-4xl font-bold font-serif mb-3 leading-tight drop-shadow-lg">
                {mainNews.title}
              </h2>
              <p className="text-white/90 text-base mb-4 line-clamp-2 drop-shadow-md">
                {mainNews.content || mainNews.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1.5">
                  <Icon name="Calendar" size={16} />
                  <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="User" size={16} />
                  <span>{mainNews.author_name}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-rows-2 gap-6">
          {sideNews.slice(0, 2).map((news) => (
            <Card
              key={news.id}
              className="group relative overflow-hidden cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => onNewsClick(news.id)}
            >
              <div className="relative h-[237px] overflow-hidden">
                {news.image_url ? (
                  <img
                    src={news.image_url}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon name="FileText" size={48} className="text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <Badge className="mb-2 bg-primary text-white font-bold px-3 py-1 text-xs uppercase">
                    {news.category}
                  </Badge>
                  <h3 className="text-white text-xl font-bold font-serif leading-tight line-clamp-2 drop-shadow-lg">
                    {news.title}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};