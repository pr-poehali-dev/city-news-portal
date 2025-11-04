import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';

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
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const sections = ['Главная', 'СВО', 'Политика', 'Экономика', 'Культура', 'Спорт', 'События', 'О портале', 'Контакты'];
  
  const handleSectionChange = (section: string) => {
    if (section === 'Главная') {
      navigate('/');
    } else if (section === 'О портале') {
      navigate('/about');
    } else if (section === 'Контакты') {
      navigate('/contacts');
    } else {
      navigate(`/?section=${section}`);
    }
  };

  const loadNews = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe?is_showbiz=true&limit=12`);
      const data = await response.json();
      const newsData = Array.isArray(data) ? data : [];
      
      if (pageNum === 1) {
        setNews(newsData);
      } else {
        setNews(prev => [...prev, ...newsData]);
      }
      
      setHasMore(newsData.length === 12);
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

  const featuredNews = news[0];
  const gridNews = news.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader
        sections={sections}
        activeSection="Главная"
        onSectionChange={handleSectionChange}
      />
      
      <main className="flex-1 pt-24">
        <div className="px-4 lg:px-20 py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Icon name="Star" size={24} className="text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                  Шоу-бизнес
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Звёзды, премьеры и светская жизнь глазами Краснодара
              </p>
            </div>

            {loading && news.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-black rounded-full mx-auto"></div>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Star" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Публикаций пока нет</p>
              </div>
            ) : (
              <>
                {featuredNews && (
                  <div 
                    className="group cursor-pointer mb-12"
                    onClick={() => navigate(`/news/${featuredNews.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-3xl">
                      <div className="aspect-[21/9] relative">
                        <img
                          src={featuredNews.image_url}
                          alt={featuredNews.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
                      <div className="max-w-3xl">
                        <span className="inline-block text-xs font-semibold text-white/80 uppercase tracking-wider mb-4">
                          Главная новость
                        </span>
                        
                        <h2 className="text-white text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                          {featuredNews.title}
                        </h2>
                        
                        <div className="flex items-center gap-6 text-white/60 text-sm">
                          <span>{new Date(featuredNews.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridNews.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/news/${item.id}`)}
                    >
                      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[16/10]">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-sm text-gray-500">
                          {new Date(item.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && !loading && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Загрузить ещё
                    </button>
                  </div>
                )}

                {loading && news.length > 0 && (
                  <div className="text-center mt-12">
                    <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-black rounded-full mx-auto"></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Showbiz;
