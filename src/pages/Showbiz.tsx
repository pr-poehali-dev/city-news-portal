import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  published_at: string;
  created_at: string;
  read_time: string;
  views: number;
  author_name?: string;
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

  const stripHtml = (html: string) => {
    if (!html) return '';
    let text = html;
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&mdash;/gi, '-');
    text = text.replace(/&[a-z]+;/gi, ' ');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  };

  const firstNews = news[0];
  const remainingNews = news.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader
        sections={sections}
        activeSection="Главная"
        onSectionChange={handleSectionChange}
      />
      
      <main className="flex-1 pt-8 md:pt-24 pb-16 max-w-full overflow-x-hidden">
        <section className="border-t-4 border-purple-600 mb-8 md:mb-12 max-w-full overflow-hidden">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 px-6 md:px-12 py-12 md:py-16 border-b-4 border-purple-600">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-4 md:mb-6">
                  ШОУБИЗ
                </h1>
                <div className="h-2 md:h-3 w-24 md:w-40 bg-yellow-400"></div>
              </div>
              <Icon name="Star" size={48} className="text-white/20 flex-shrink-0 md:w-20 md:h-20" />
            </div>
          </div>

          {loading && page === 1 ? (
            <div className="text-center py-12 bg-white">
              <Icon name="Loader" size={32} className="animate-spin mx-auto text-purple-600" />
              <p className="mt-4 text-muted-foreground">Загружаем звёздные новости...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 bg-white">
              <Icon name="Star" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Пока нет новостей</h3>
              <p className="text-muted-foreground">Звёздные истории скоро появятся здесь</p>
            </div>
          ) : (
            <div className="bg-white">
              {firstNews && (
                <article
                  className="group cursor-pointer overflow-hidden bg-white border-b-4 border-purple-600 transition-all hover:shadow-[8px_8px_0px_0px_rgba(147,51,234,0.3)] md:flex md:flex-row"
                  onClick={() => navigate(`/news/${firstNews.id}`)}
                >
                  <div className="md:w-1/2 aspect-[16/9] md:aspect-auto relative overflow-hidden bg-black md:border-r-4 border-purple-600">
                    {firstNews.image_url ? (
                      <img
                        src={firstNews.image_url}
                        alt={firstNews.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Icon name="Star" size={64} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-none"></div>
                    
                    <div className="absolute top-3 left-3">
                      <div className="inline-block px-4 py-2 bg-yellow-400 border-2 border-purple-600 shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]">
                        <span className="text-purple-900 font-black text-xs uppercase tracking-wider">
                          ⭐ Главное
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="inline-block px-3 py-1.5 bg-purple-600 w-fit mb-4">
                      <span className="text-white font-black text-xs uppercase tracking-wider">
                        {firstNews.category}
                      </span>
                    </div>
                    
                    <h3 className="text-foreground font-black uppercase leading-[1.1] tracking-tight mb-4 text-xl md:text-2xl lg:text-3xl group-hover:text-purple-600 transition-colors">
                      {firstNews.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-2 leading-relaxed hidden md:block">
                      {stripHtml(firstNews.excerpt || firstNews.content)}
                    </p>
                    
                    <div className="flex items-center gap-3 text-muted-foreground text-xs uppercase tracking-wider font-bold">
                      <Icon name="Clock" size={14} />
                      <span>{new Date(firstNews.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                      <span className="w-1 h-1 bg-purple-600 rounded-full"></span>
                      <span className="truncate">{firstNews.author_name || 'Редакция'}</span>
                    </div>
                  </div>
                </article>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
                {remainingNews.map((item, index) => {
                  return (
                    <article
                      key={item.id}
                      className="group cursor-pointer overflow-hidden bg-white border-b-4 border-r-4 last:border-r-0 md:last:border-r-4 md:[&:nth-child(3n)]:border-r-0 border-purple-600 transition-all hover:shadow-[8px_8px_0px_0px_rgba(147,51,234,0.3)] hover:z-10"
                      onClick={() => navigate(`/news/${item.id}`)}
                    >
                      <div className="aspect-square relative overflow-hidden bg-black">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Icon name="Star" size={32} className="text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        
                        <div className="absolute top-2 left-2">
                          <div className="inline-block px-2 py-1 bg-purple-600">
                            <span className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-wider">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white font-black uppercase leading-[1.1] tracking-tight text-xs md:text-sm line-clamp-3 group-hover:text-yellow-300 transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                            {item.title}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 text-white/80 text-[9px] uppercase tracking-wider font-bold mt-2">
                            <Icon name="Clock" size={10} />
                            <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {hasMore && (
                <div className="text-center py-8 bg-white border-b-4 border-purple-600">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase border-2 border-purple-900 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] hover:shadow-none transition-all"
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
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Showbiz;
