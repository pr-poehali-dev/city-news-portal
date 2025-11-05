import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface MemoryArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  year: number;
  decade: string;
  event_date: string;
  image_url: string;
  is_published: boolean;
}

interface MemorySectionProps {
  articles: MemoryArticle[];
  onArticleClick: (id: number) => void;
}

export function MemorySection({ articles, onArticleClick }: MemorySectionProps) {
  const navigate = useNavigate();
  const publishedArticles = articles.filter(a => a.is_published);
  
  if (publishedArticles.length === 0) return null;

  const latestArticle = publishedArticles[0];
  const otherArticles = publishedArticles.slice(1, 3);

  return (
    <section className="mb-0 md:mb-0 border-t-4 border-primary w-screen relative left-[50%] right-[50%] -mx-[50vw]">
      <div className="bg-primary px-6 md:px-12 py-12 md:py-16 border-b-4 border-primary">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-4 md:mb-6">
              ПАМЯТЬ
            </h2>
            <div className="h-2 md:h-3 w-24 md:w-40 bg-accent"></div>
          </div>
          <div 
            onClick={() => navigate('/memory')}
            className="cursor-pointer hidden md:block"
          >
            <Icon name="ArrowUpRight" size={48} className="text-white/20 flex-shrink-0 md:w-20 md:h-20 hover:text-white/40 transition-colors" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-full">
        <Card 
          className="md:col-span-2 group relative cursor-pointer overflow-hidden bg-white border-b-4 border-primary md:border-b-4 md:border-r-4 transition-all hover:z-10 rounded-none"
          onClick={() => onArticleClick(latestArticle.id)}
        >
          <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-black">
            {latestArticle.image_url ? (
              <img
                src={latestArticle.image_url}
                alt={latestArticle.title}
                className="w-full h-full object-cover sepia-[0.3] contrast-110 group-hover:sepia-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full bg-[#FF851B]/20 flex items-center justify-center">
                <Icon name="Clock" size={80} className="text-[#FF851B]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
            
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <div className="bg-primary px-5 py-2.5">
                <span className="text-white font-black text-sm uppercase tracking-wider">
                  {latestArticle.year}
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
              <h3 className="text-white text-xl md:text-3xl font-black uppercase leading-[1.1] tracking-tight mb-3 md:mb-4 group-hover:text-accent transition-colors [text-shadow:_3px_3px_0_rgb(0_0_0_/_100%)] line-clamp-2">
                {latestArticle.title}
              </h3>
              
              <p className="text-white/90 text-base md:text-xl mb-4 md:mb-6 line-clamp-2 max-w-4xl hidden md:block leading-relaxed">
                {latestArticle.excerpt}
              </p>
              
              <div className="flex items-center gap-3 md:gap-4 text-white/70 text-xs md:text-sm uppercase tracking-wider font-bold flex-wrap">
                <span>{latestArticle.event_date 
                  ? new Date(latestArticle.event_date).toLocaleDateString('ru-RU')
                  : `${latestArticle.year} год`
                }</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="md:col-span-1 flex flex-col gap-0">
          {otherArticles.map((article, index) => (
            <Card
              key={article.id}
              className={`group relative cursor-pointer overflow-hidden bg-white transition-all hover:z-10 rounded-none ${
                index === 0 ? 'border-b-4 border-primary' : ''
              }`}
              onClick={() => onArticleClick(article.id)}
            >
              <div className="aspect-[16/9] md:aspect-[4/3] relative overflow-hidden bg-black">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover sepia-[0.3] contrast-110 group-hover:sepia-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FF851B]/20 flex items-center justify-center">
                    <Icon name="Clock" size={48} className="text-[#FF851B]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                <div className="absolute top-4 left-4">
                  <div className="bg-primary px-4 py-2">
                    <span className="text-white font-black text-sm">{article.year}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h4 className="text-white text-base md:text-xl font-black uppercase leading-[1.1] tracking-tight line-clamp-2 group-hover:text-accent transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white border-b-4 border-primary p-6 text-center">
        <button
          onClick={() => navigate('/memory')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-black uppercase text-sm transition-all border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
        >
          Все статьи памяти
          <Icon name="ArrowRight" size={18} />
        </button>
      </div>
    </section>
  );
}