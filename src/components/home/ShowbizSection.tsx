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

  if (loading) {
    return (
      <section className="bg-white">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-black rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="flex items-end justify-between mb-16 lg:mb-24">
          <div>
            <h2 className="text-5xl lg:text-8xl font-black tracking-tight mb-4">
              Шоу-бизнес
            </h2>
            <div className="w-24 h-1 bg-purple-600"></div>
          </div>
          
          <Link 
            to="/showbiz"
            className="hidden lg:flex items-center gap-3 px-8 py-4 bg-black text-white font-black hover:bg-gray-800 transition-colors"
          >
            <span className="tracking-wider">ВСЕ СТАТЬИ</span>
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {news.map((item) => (
            <article
              key={item.id}
              className="group cursor-pointer bg-white hover:bg-purple-600 transition-colors duration-300"
              onClick={() => navigate(`/news/${item.id}`)}
            >
              <div className="p-8 lg:p-12 h-full flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-mono tracking-widest uppercase text-purple-600 group-hover:text-white transition-colors">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-black leading-tight mb-6 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 group-hover:text-purple-200 transition-colors">
                  <Icon name="Calendar" size={12} />
                  <span>{new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="lg:hidden mt-8">
          <Link 
            to="/showbiz"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-black w-full"
          >
            <span className="tracking-wider">ВСЕ СТАТЬИ</span>
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};
