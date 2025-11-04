import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface News {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  published_at: string;
  read_time: string;
  created_at: string;
  author_name: string;
}

export const ShowbizSection = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowbizNews = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?is_showbiz=true&limit=3');
        const data = await response.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch showbiz news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowbizNews();
  }, []);

  if (loading || news.length === 0) return null;

  const [mainNews, ...sideNews] = news;

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-[#B10DC9] px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              ШОУБИЗ
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-white"></div>
          </div>
          <Link to="/showbiz" className="hidden md:block">
            <Icon name="ArrowUpRight" size={48} className="text-white/30 flex-shrink-0 md:w-16 md:h-16 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {mainNews && (
          <Link 
            to={`/news/${mainNews.id}`} 
            className="md:col-span-2 group relative cursor-pointer overflow-hidden bg-white border-b-4 md:border-b-0 md:border-r-4 border-primary transition-all hover:z-10"
          >
            <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-black">
              <img
                src={mainNews.image_url}
                alt={mainNews.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="absolute top-3 left-3 md:top-6 md:left-6">
                <div className="bg-[#B10DC9] px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                    <Icon name="Star" size={14} className="inline mr-2" />
                    Шоубиз
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-12">
                <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter mb-2 md:mb-3 group-hover:text-[#B10DC9] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)] line-clamp-2">
                  {mainNews.title}
                </h3>
                
                <div className="flex items-center gap-2 md:gap-4 text-white/60 text-[10px] md:text-xs uppercase tracking-wider font-bold flex-wrap">
                  <span>{new Date(mainNews.created_at).toLocaleDateString('ru-RU')}</span>
                  <span className="w-1 h-1 bg-[#B10DC9] rounded-full"></span>
                  <span className="truncate max-w-[120px] md:max-w-none">{mainNews.author_name || 'Редакция'}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="md:col-span-1 flex flex-col gap-0">
          {sideNews.slice(0, 2).map((item, index) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className={`group relative cursor-pointer overflow-hidden bg-white transition-all hover:z-10 ${
                index === 0 ? 'border-b-4 border-primary' : ''
              }`}
            >
              <div className="aspect-[16/9] md:aspect-[4/3] relative overflow-hidden bg-black">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h4 className="text-white text-lg md:text-xl font-black uppercase leading-tight tracking-tighter line-clamp-2 group-hover:text-[#B10DC9] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                    {item.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="md:hidden bg-white border-b-4 border-primary p-4">
        <Link to="/showbiz">
          <div className="flex items-center justify-center gap-2 text-black font-black uppercase text-sm hover:text-[#B10DC9] transition-colors">
            Все новости
            <Icon name="ArrowRight" size={16} />
          </div>
        </Link>
      </div>
    </section>
  );
};
