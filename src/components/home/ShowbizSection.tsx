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

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-2">
              Шоу-бизнес
            </h2>
            <div className="w-20 h-1 bg-white"></div>
          </div>
          
          <Link 
            to="/showbiz"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-900 font-black hover:bg-gray-200 transition-colors"
          >
            <span className="tracking-wider">ВСЕ СТАТЬИ</span>
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {news.map((item, index) => {
            const isLarge = index === 0;
            const isHovered = hoveredId === item.id;
            
            return (
              <article
                key={item.id}
                className={`group relative cursor-pointer overflow-hidden ${
                  isLarge ? 'md:row-span-2' : ''
                }`}
                onClick={() => navigate(`/news/${item.id}`)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden ${
                  isLarge ? 'aspect-[3/4]' : 'aspect-[16/10]'
                }`}>
                  <img
                    src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-all duration-[1500ms] ${
                      isHovered ? 'scale-110 brightness-90' : 'scale-100'
                    }`}
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-80'
                  }`}></div>

                  <div className="absolute top-6 left-6 z-10">
                    <span className={`inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isHovered ? 'bg-purple-600 backdrop-blur-none' : ''
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 transition-all duration-500 ${
                    isLarge ? 'lg:p-12' : ''
                  } ${
                    isHovered ? 'translate-y-0' : 'translate-y-2'
                  }`}>
                    <h3 className={`text-white font-black leading-tight mb-4 transition-all duration-300 ${
                      isLarge ? 'text-2xl lg:text-4xl' : 'text-xl lg:text-2xl'
                    }`}>
                      {item.title}
                    </h3>
                    
                    <div className={`flex items-center gap-3 text-gray-400 text-sm transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-70'
                    }`}>
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
