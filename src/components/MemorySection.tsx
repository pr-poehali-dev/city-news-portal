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
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-[#FF851B] px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              ПАМЯТЬ
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-white"></div>
          </div>
          <div 
            onClick={() => navigate('/memory')}
            className="cursor-pointer hidden md:block"
          >
            <Icon name="ArrowUpRight" size={48} className="text-white/30 flex-shrink-0 md:w-16 md:h-16 hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        <Card 
          className="md:col-span-2 group relative cursor-pointer overflow-hidden bg-white border-b-4 md:border-b-0 md:border-r-4 border-primary transition-all hover:z-10 rounded-none"
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
            
            <div className="absolute top-3 left-3 md:top-6 md:left-6">
              <div className="bg-[#FF851B] px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                  {latestArticle.year}
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-12">
              <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter mb-2 md:mb-3 group-hover:text-[#FF851B] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)] line-clamp-2">
                {latestArticle.title}
              </h3>
              
              <p className="text-white/80 text-sm md:text-lg mb-3 md:mb-4 line-clamp-2 max-w-4xl hidden md:block">
                {latestArticle.excerpt}
              </p>
              
              <div className="flex items-center gap-2 md:gap-4 text-white/60 text-[10px] md:text-xs uppercase tracking-wider font-bold flex-wrap">
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
                
                <div className="absolute top-3 left-3">
                  <div className="bg-[#FF851B] px-3 py-1 border-2 border-primary">
                    <span className="text-white font-black text-xs">{article.year}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h4 className="text-white text-lg md:text-xl font-black uppercase leading-tight tracking-tighter line-clamp-2 group-hover:text-[#FF851B] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                    {article.title}
                  </h4>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="md:hidden bg-white border-b-4 border-primary p-4">
        <div 
          onClick={() => navigate('/memory')}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 text-black font-black uppercase text-sm hover:text-[#FF851B] transition-colors">
            Все статьи
            <Icon name="ArrowRight" size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}