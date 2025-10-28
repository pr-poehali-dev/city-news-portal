import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface News {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  published_at: string;
  read_time: string;
  views: number;
}

const Showbiz = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNews = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?is_showbiz=true&page=${pageNum}&limit=12`);
      const data = await response.json();
      
      if (pageNum === 1) {
        setNews(data.news || []);
      } else {
        setNews(prev => [...prev, ...(data.news || [])]);
      }
      
      setHasMore((data.news || []).length === 12);
    } catch (error) {
      console.error('Failed to fetch showbiz news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNews(nextPage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white py-16 mb-12">
          <div className="absolute inset-0 bg-[url('/images/stars-pattern.svg')] opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Icon name="Star" size={48} className="text-yellow-300" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Город говорит о шоубизе
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">
              Звёзды, премьеры, скандалы и светская жизнь — всё самое яркое из мира шоу-бизнеса глазами Краснодара
            </p>
            <div className="flex gap-4 mt-6">
              <Badge className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2">
                <Icon name="Sparkles" size={14} className="mr-2" />
                Эксклюзив
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2">
                <Icon name="Camera" size={14} className="mr-2" />
                Фото
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2">
                <Icon name="Mic" size={14} className="mr-2" />
                Интервью
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {loading && page === 1 ? (
            <div className="text-center py-12">
              <Icon name="Loader" size={32} className="animate-spin mx-auto text-purple-600" />
              <p className="mt-4 text-muted-foreground">Загружаем звёздные новости...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Star" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Пока нет новостей</h3>
              <p className="text-muted-foreground">Звёздные истории скоро появятся здесь</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {news.map((item) => (
                  <Link key={item.id} to={`/news/${item.id}`} className="group">
                    <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-purple-100 hover:border-purple-400">
                      <div className="relative h-56">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700 text-white">
                          <Icon name="Star" size={12} className="mr-1" />
                          {item.category}
                        </Badge>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-3 text-white/80 text-xs">
                            <div className="flex items-center gap-1">
                              <Icon name="Eye" size={12} />
                              <span>{item.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              <span>{item.read_time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {item.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="text-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? (
                      <>
                        <Icon name="Loader" size={16} className="animate-spin mr-2" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        Загрузить ещё
                        <Icon name="ChevronDown" size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Showbiz;
