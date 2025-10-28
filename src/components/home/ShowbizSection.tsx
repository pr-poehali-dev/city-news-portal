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
    <section className="py-12 md:py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Star" size={32} className="text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Город говорит о шоубизе
              </h2>
            </div>
            <p className="text-muted-foreground text-sm md:text-base">
              Звёзды, премьеры и светская жизнь глазами Краснодара
            </p>
          </div>
          <Link to="/showbiz">
            <Button variant="outline" className="hidden md:flex gap-2 border-purple-300 hover:bg-purple-100">
              Все новости
              <Icon name="ArrowRight" size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mainNews && (
            <Link to={`/news/${mainNews.id}`} className="group">
              <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-300 border-purple-200 hover:border-purple-400">
                <div className="relative h-80">
                  <img
                    src={mainNews.image_url}
                    alt={mainNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-purple-600 hover:bg-purple-700 text-white">
                    <Icon name="Star" size={12} className="mr-1" />
                    {mainNews.category}
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-purple-200 transition-colors">
                      {mainNews.title}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2 mb-3">
                      {mainNews.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Icon name="Clock" size={14} />
                      <span>{mainNews.read_time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          <div className="space-y-4">
            {sideNews.slice(0, 2).map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-purple-100 hover:border-purple-300">
                  <div className="flex gap-4 p-4">
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-2 bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs">
                        <Icon name="Sparkles" size={10} className="mr-1" />
                        {item.category}
                      </Badge>
                      <h4 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Icon name="Clock" size={12} />
                        <span>{item.read_time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            <Link to="/showbiz" className="md:hidden">
              <Button variant="outline" className="w-full gap-2 border-purple-300 hover:bg-purple-100">
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