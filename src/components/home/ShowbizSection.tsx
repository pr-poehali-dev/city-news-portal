import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { MagneticCard } from '../MagneticCard';
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
      <section className="py-32 px-6 lg:px-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-black rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  return (
    <section className="py-32 px-6 lg:px-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Icon name="Star" size={32} className="text-white" />
              </div>
              <h2 className="text-5xl lg:text-8xl font-black tracking-tight">
                Шоу-бизнес
              </h2>
            </div>
            <Link to="/showbiz" className="hidden lg:block flex-shrink-0">
              <button className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-3 whitespace-nowrap">
                Все новости
                <Icon name="ArrowRight" size={20} />
              </button>
            </Link>
          </div>
          <p className="text-gray-500 text-xl lg:text-2xl font-light">
            Звёзды и светская жизнь глазами Краснодара
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <MagneticCard
              key={item.id}
              onClick={() => navigate(`/news/${item.id}`)}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-3xl overflow-hidden h-full">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={item.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <div className="p-8">
                  <span className="inline-block text-xs font-bold text-purple-600 uppercase tracking-wider mb-4">
                    {item.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
};