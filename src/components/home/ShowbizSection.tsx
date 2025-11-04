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
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchShowbizNews = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?is_showbiz=true&limit=4');
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

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-7xl lg:text-9xl font-black text-white mb-4">
              Звёзды
            </h2>
            <h2 className="text-7xl lg:text-9xl font-black text-white/20">
              и стиль
            </h2>
          </div>
          <Link 
            to="/showbiz"
            className="hidden lg:flex items-center gap-3 px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:scale-105 transition-transform"
          >
            ВСЕ СТАТЬИ
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, index) => {
            const isHovered = hoveredId === item.id;
            const isLarge = index === 0;
            
            return (
              <article
                key={item.id}
                className={`group cursor-pointer ${isLarge ? 'md:col-span-2' : ''}`}
                onClick={() => navigate(`/news/${item.id}`)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-500 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}>
                  <div className={`relative ${isLarge ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                    <img
                      src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 ${isLarge ? 'lg:p-12' : ''}`}>
                      <div className="inline-block px-4 py-2 bg-white text-purple-600 text-xs font-bold mb-4 rounded-full">
                        {item.category}
                      </div>
                      
                      <h3 className={`text-white font-black leading-tight mb-4 ${
                        isLarge ? 'text-3xl lg:text-5xl' : 'text-2xl lg:text-3xl'
                      }`}>
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Link 
          to="/showbiz"
          className="lg:hidden mt-8 flex items-center justify-center gap-3 px-8 py-4 bg-white text-purple-600 font-bold rounded-full"
        >
          ВСЕ СТАТЬИ
          <Icon name="ArrowRight" size={20} />
        </Link>
      </div>
    </section>
  );
};
