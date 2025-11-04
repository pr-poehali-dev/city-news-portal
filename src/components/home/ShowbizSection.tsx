import { Link, useNavigate } from 'react-router-dom';
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
}

export const ShowbizSection = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchShowbizNews = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?is_showbiz=true&limit=5');
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

  if (loading) {
    return (
      <section className="bg-black py-20 lg:py-32">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="bg-black text-white py-20 lg:py-32">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              ЗВЁЗДЫ И СВЕТСКАЯ ЖИЗНЬ
            </span>
            <h2 className="text-5xl lg:text-7xl font-black">
              Шоу-бизнес
            </h2>
          </div>
          <Link 
            to="/showbiz"
            className="hidden lg:flex items-center gap-2 text-sm font-bold tracking-wider hover:text-red-500 transition-colors"
          >
            ВСЕ СТАТЬИ
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>

        <div className="relative h-[600px] lg:h-[700px]">
          {news.map((item, index) => {
            const isActive = activeIndex === index;
            const offset = (index - activeIndex) * 100;
            
            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{
                  transform: `translateX(${offset}%)`
                }}
              >
                <div 
                  className="h-full cursor-pointer group"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                      <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                        {item.category}
                      </span>
                      
                      <h3 className="text-3xl lg:text-5xl font-black leading-tight mb-6">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <div className="flex gap-3">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all ${
                  activeIndex === index
                    ? 'w-16 h-1 bg-red-600'
                    : 'w-8 h-1 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))}
              className="w-12 h-12 border border-white/20 hover:bg-white hover:text-black transition-colors flex items-center justify-center"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1))}
              className="w-12 h-12 border border-white/20 hover:bg-white hover:text-black transition-colors flex items-center justify-center"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        <Link 
          to="/showbiz"
          className="lg:hidden mt-8 flex items-center justify-center gap-2 text-sm font-bold tracking-wider hover:text-red-500 transition-colors"
        >
          ВСЕ СТАТЬИ
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
    </section>
  );
};
