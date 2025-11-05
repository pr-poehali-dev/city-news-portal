import { Link } from 'react-router-dom';
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
        const response = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?is_showbiz=true&limit=6');
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

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-primary px-6 md:px-12 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Icon name="Star" size={32} className="text-accent flex-shrink-0 md:w-12 md:h-12" />
            <div className="min-w-0">
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter">
                ШОУБИЗ
              </h2>
            </div>
          </div>
          <Link to="/showbiz" className="hidden md:block">
            <Icon name="ArrowUpRight" size={32} className="text-white/30 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>

      <div className="bg-white divide-y-2 divide-gray-200 border-b-4 border-primary">
        {news.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="group cursor-pointer flex gap-3 p-4 hover:bg-gray-50 transition-colors block"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative overflow-hidden bg-black rounded-lg">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                  <Icon name="Star" size={24} className="text-accent" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="inline-block px-2 py-0.5 bg-accent w-fit mb-2">
                <span className="text-white font-bold text-[9px] md:text-[10px] uppercase tracking-wide">
                  {item.category}
                </span>
              </div>
              
              <h3 className="text-foreground font-bold leading-tight mb-1 text-sm md:text-base line-clamp-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              
              <div className="flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs mt-1">
                <Icon name="Clock" size={12} />
                <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white border-b-4 border-primary p-6 text-center">
        <Link to="/showbiz">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-black uppercase text-sm transition-all border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5">
            Все новости шоубиза
            <Icon name="ArrowRight" size={18} />
          </button>
        </Link>
      </div>
    </section>
  );
};