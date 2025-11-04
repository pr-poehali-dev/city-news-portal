import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useState, useEffect, useRef } from 'react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchShowbizNews = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?is_showbiz=true&limit=8');
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || news.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 border-l-4 border-pink-600 pl-4">
            ⭐ Звёзды и стиль
          </h2>
          
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full hover:bg-pink-600 hover:text-white transition-all shadow-md"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full hover:bg-pink-600 hover:text-white transition-all shadow-md"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
            <Link
              to="/showbiz"
              className="ml-2 px-4 py-2 bg-pink-600 text-white text-sm font-bold rounded-full hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              ВСЕ СТАТЬИ
              <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {news.map((item) => {
            const isHovered = hoveredId === item.id;
            
            return (
              <article
                key={item.id}
                className="flex-shrink-0 w-[280px] group cursor-pointer"
                onClick={() => navigate(`/news/${item.id}`)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-gray-900 font-bold text-base leading-tight mb-3 line-clamp-3 group-hover:text-pink-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Icon name="Calendar" size={14} />
                      <span>
                        {new Date(item.published_at).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          to="/showbiz"
          className="lg:hidden mt-6 w-full px-4 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
        >
          ВСЕ СТАТЬИ
          <Icon name="ArrowRight" size={20} />
        </Link>
      </div>
    </section>
  );
};
