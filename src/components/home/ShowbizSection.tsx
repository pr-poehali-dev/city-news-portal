import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      <section className="py-12 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Загрузка...</div>
        </div>
      </section>
    );
  }

  if (news.length === 0) return null;

  const [mainNews, ...sideNews] = news;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Icon name="Sparkles" size={20} className="text-yellow-300" />
            <span className="text-white font-medium text-sm">Город говорит о шоубизе</span>
          </div>
          <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto">
            Звёзды, премьеры и светская жизнь глазами Краснодара
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mainNews && (
            <Link to={`/news/${mainNews.id}`} className="md:col-span-2 lg:col-span-2 group">
              <Card className="overflow-hidden h-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 bg-white/95 backdrop-blur">
                <div className="relative h-[300px] md:h-[420px]">
                  <img
                    src={mainNews.image_url}
                    alt={mainNews.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1.5 shadow-lg">
                    <Icon name="Star" size={12} className="mr-1.5" />
                    {mainNews.category}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl md:text-3xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                      {mainNews.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base line-clamp-2">
                      {mainNews.excerpt}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          <div className="space-y-4 md:space-y-6">
            {sideNews.slice(0, 2).map((item, idx) => (
              <Link key={item.id} to={`/news/${item.id}`} className="group block">
                <Card className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/95 backdrop-blur">
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <Badge className={`absolute top-3 right-3 border-0 text-xs ${
                      idx === 0 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/90 text-purple-700'
                    }`}>
                      <Icon name="Sparkles" size={10} className="mr-1" />
                      {item.category}
                    </Badge>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-bold text-white text-base md:text-lg line-clamp-2 group-hover:text-yellow-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/showbiz">
            <Button className="gap-2 bg-white text-purple-600 hover:bg-white/90 font-semibold shadow-xl px-8">
              Все новости шоубизнеса
              <Icon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};