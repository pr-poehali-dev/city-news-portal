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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader
        sections={sections}
        activeSection="Главная"
        onSectionChange={handleSectionChange}
      />
      
      <main className="flex-1 pt-8 md:pt-24 pb-16 max-w-full overflow-x-hidden">
        <section className="border-t-4 border-primary mb-8 md:mb-12 max-w-full overflow-hidden">
          <div className="bg-primary px-6 md:px-12 py-8 md:py-12 border-b-4 border-primary">
            <div className="flex items-center gap-3">
              <Icon name="Star" size={32} className="text-accent flex-shrink-0 md:w-12 md:h-12" />
              <div className="min-w-0">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter">
                  ШОУБИЗ
                </h1>
              </div>
            </div>
          </div>

          {loading && page === 1 ? (
            <div className="text-center py-8 bg-white">
              <Icon name="Loader" size={24} className="animate-spin mx-auto text-purple-600" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-8 bg-white">
              <Icon name="Star" size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Пока нет новостей</p>
            </div>
          ) : (
            <div className="bg-white divide-y-2 divide-gray-200">
              {news.map((item, index) => (
                <article
                  key={item.id}
                  className="group cursor-pointer flex gap-3 p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative overflow-hidden bg-black rounded-lg">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                        <Icon name="Star" size={24} className="text-accent" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="inline-block px-2 py-0.5 bg-accent w-fit mb-2">
                      <span className="text-white font-bold text-[9px] md:text-[10px] uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                    
                    <h3 className="text-foreground font-bold leading-tight mb-1 text-sm md:text-base line-clamp-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-muted-foreground text-[10px] md:text-xs mt-1">
                      <Icon name="Clock" size={12} />
                      <span>{new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center py-6 bg-white border-t-2 border-gray-200">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white font-bold"
              >
                {loading ? (
                  <>
                    <Icon name="Loader" size={14} className="animate-spin mr-2" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    Загрузить ещё
                    <Icon name="ChevronDown" size={14} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Showbiz;