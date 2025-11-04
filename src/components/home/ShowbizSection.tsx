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
    <section className="py-12 md:py-16 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden border-y">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold">
                Город говорит о шоубизе
              </h2>
            </div>
            <p className="text-muted-foreground text-sm md:text-base ml-14">
              Звёзды, премьеры и светская жизнь глазами Краснодара
            </p>
          </div>
          <Link to="/showbiz" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              Все новости
              <Icon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mainNews && (
            <Link to={`/news/${mainNews.id}`} className="md:col-span-2 lg:col-span-2 group">
              <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500/20">
                <div className="relative h-[300px] md:h-[420px]">
                  <img
                    src={mainNews.image_url}
                    alt={mainNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1.5 shadow-lg">
                    <Icon name="Star" size={12} className="mr-1.5" />
                    {mainNews.category}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-xl md:text-3xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
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
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-purple-500/30">
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs shadow-md">
                      <Icon name="Sparkles" size={10} className="mr-1" />
                      {item.category}
                    </Badge>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-bold text-white text-base md:text-lg line-clamp-2 group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/showbiz">
            <Button variant="outline" className="gap-2 w-full">
              Все новости шоубизнеса
              <Icon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};