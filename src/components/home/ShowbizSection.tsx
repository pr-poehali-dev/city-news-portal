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
    <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Город говорит о шоубизе
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg ml-14">
              Звёзды, премьеры и светская жизнь глазами Краснодара
            </p>
          </div>
          <Link to="/showbiz">
            <Button className="hidden md:flex gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
              Все новости
              <Icon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {mainNews && (
            <Link to={`/news/${mainNews.id}`} className="lg:col-span-2 group">
              <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-500 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="relative h-[400px] md:h-[500px]">
                  <img
                    src={mainNews.image_url}
                    alt={mainNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <Badge className="absolute top-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 text-sm shadow-lg">
                    <Icon name="Star" size={14} className="mr-2" />
                    {mainNews.category}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-2xl md:text-4xl font-bold mb-3 group-hover:text-purple-200 transition-colors leading-tight">
                      {mainNews.title}
                    </h3>
                    <p className="text-white/90 text-base md:text-lg line-clamp-2">
                      {mainNews.excerpt}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          <div className="space-y-6">
            {sideNews.slice(0, 2).map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="group block">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-white/95 text-slate-900 border-0 text-xs">
                      <Icon name="Sparkles" size={10} className="mr-1 text-purple-600" />
                      {item.category}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg line-clamp-3 group-hover:text-purple-600 transition-colors dark:text-white dark:group-hover:text-purple-400">
                      {item.title}
                    </h4>
                  </div>
                </Card>
              </Link>
            ))}

            <Link to="/showbiz" className="lg:hidden">
              <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                Все новости шоубизнеса
                <Icon name="ArrowRight" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};