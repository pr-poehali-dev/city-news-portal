import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { FeaturedNews } from '@/components/FeaturedNews';
import { EventsSection } from '@/components/EventsSection';
import { MiniNewsCard } from '@/components/MiniNewsCard';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/Footer';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d',
  weather: 'https://functions.poehali.dev/5531fc0c-ecba-421c-bfb4-245613816060',
  comments: 'https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5'
};

const Index = () => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [featuredNews, setFeaturedNews] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [activeSection, setActiveSection] = useState('Главная');
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [topThreeNews, setTopThreeNews] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const sections = [
    'Главная',
    'Политика',
    'Экономика',
    'Культура',
    'Спорт',
    'События',
    'О портале',
    'Контакты'
  ];

  useEffect(() => {
    loadNews();
    loadEvents();
    loadWeather();
    loadLatestForTicker();
    
    const savedLikes = localStorage.getItem('likedArticles');
    if (savedLikes) {
      setLikedArticles(new Set(JSON.parse(savedLikes)));
    }
  }, []);

  useEffect(() => {
    if (activeSection !== 'Главная') {
      loadNews(activeSection);
    } else {
      loadNews();
    }
  }, [activeSection]);

  useEffect(() => {
    if (topThreeNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prev) => {
        const nextIndex = (prev + 1) % topThreeNews.length;
        setFeaturedNews(topThreeNews[nextIndex]);
        return nextIndex;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [topThreeNews]);

  const loadNews = async (category?: string) => {
    try {
      const url = category ? `${FUNCTIONS_URL.news}?category=${encodeURIComponent(category)}` : FUNCTIONS_URL.news;
      const response = await fetch(url);
      const data = await response.json();
      
      // Сортируем по дате (новые первыми)
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Берем топ-3 новости для ротации в главной
      const top3 = sortedData.slice(0, 3);
      setTopThreeNews(top3);
      
      // Главная новость: первая из топ-3
      setFeaturedNews(top3[0]);
      
      // Все новости (включая топ-3)
      setArticles(sortedData);
    } catch (error) {
      console.error('Failed to load news:', error);
    }
  };

  const loadLatestForTicker = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.news);
      const data = await response.json();
      setLatestNews(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load latest news:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.events);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadWeather = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.weather);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
    }
  };

  const loadComments = async (newsId: number) => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.comments}?news_id=${newsId}`);
      const data = await response.json();
      setComments(prev => ({ ...prev, [newsId]: data }));
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async (newsId: number) => {
    if (!commentName.trim() || !commentText.trim()) return;

    try {
      const response = await fetch(FUNCTIONS_URL.comments, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          news_id: newsId,
          author_name: commentName,
          text: commentText
        })
      });

      if (response.ok) {
        setCommentName('');
        setCommentText('');
        loadComments(newsId);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleArticleClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  const handleLike = async (newsId: number) => {
    if (likedArticles.has(newsId)) return;

    try {
      await fetch(`${FUNCTIONS_URL.news}?id=${newsId}&increment_likes=true`);
      const newLikedArticles = new Set(likedArticles).add(newsId);
      setLikedArticles(newLikedArticles);
      localStorage.setItem('likedArticles', JSON.stringify([...newLikedArticles]));
      
      setArticles(prev => prev.map(article => 
        article.id === newsId 
          ? { ...article, likes: (article.likes || 0) + 1 }
          : article
      ));
      
      setTopThreeNews(prev => prev.map(article => 
        article.id === newsId 
          ? { ...article, likes: (article.likes || 0) + 1 }
          : article
      ));
      
      if (featuredNews?.id === newsId) {
        setFeaturedNews((prev: any) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
    } catch (error) {
      console.error('Failed to like article:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NewsTicker latestNews={latestNews} />
      
      <SiteHeader 
        weather={weather}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="container mx-auto px-4 py-8">
        {articles.length === 0 && !featuredNews ? (
          <Card className="p-12 text-center">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-serif font-bold mb-2">Новостей пока нет</h2>
            <p className="text-muted-foreground mb-6">
              Добавьте первую новость через админ-панель
            </p>
            <Button onClick={() => window.location.href = '/admin'}>
              Перейти в админку
            </Button>
          </Card>
        ) : (
          <>
            {featuredNews && activeSection === 'Главная' && (
              <>
                {/* Главная новость - большая плашка */}
                <div className="mb-8" onClick={() => handleArticleClick(featuredNews.id)}>
                  <FeaturedNews 
                    news={featuredNews} 
                    currentIndex={currentFeaturedIndex}
                    totalCount={topThreeNews.length}
                  />
                </div>
                
                {/* Следующие 2 новости из топ-3 + еще одна */}
                {topThreeNews.length > 1 && (
                  <div className="mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                      {topThreeNews.slice(1, 3).concat(articles.slice(3, 4)).map((article) => (
                        <MiniNewsCard
                          key={article.id}
                          news={article}
                          onClick={() => handleArticleClick(article.id)}
                          onLike={(e) => {
                            e.stopPropagation();
                            handleLike(article.id);
                          }}
                          hasLiked={likedArticles.has(article.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Остальные новости - только заголовки */}
                {articles.length > 4 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-serif font-bold mb-4 border-b pb-2">Все новости</h3>
                    <div className="space-y-3">
                      {articles.slice(4).map((article) => (
                        <div 
                          key={article.id}
                          onClick={() => handleArticleClick(article.id)}
                          className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{article.section}</Badge>
                              <span className="text-xs text-muted-foreground">{article.date}</span>
                            </div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {article.title}
                            </h4>
                          </div>
                          <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeSection !== 'Главная' && (
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{article.section}</Badge>
                        <span className="text-sm text-muted-foreground">{article.date}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {article.content}
                      </p>
                      <Button variant="link" className="p-0">
                        Читать далее →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <EventsSection events={events} />
          </>
        )}
      </main>

      <Footer sections={sections} onSectionChange={setActiveSection} />
    </div>
  );
};

export default Index;