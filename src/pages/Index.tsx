import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { FeaturedNews } from '@/components/FeaturedNews';
import { NewsArticle } from '@/components/NewsArticle';
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
  }, []);

  useEffect(() => {
    if (activeSection !== 'Главная') {
      loadNews(activeSection);
    } else {
      loadNews();
    }
  }, [activeSection]);

  const loadNews = async (category?: string) => {
    try {
      const url = category ? `${FUNCTIONS_URL.news}?category=${encodeURIComponent(category)}` : FUNCTIONS_URL.news;
      const response = await fetch(url);
      const data = await response.json();
      
      const featured = data.find((n: any) => n.is_featured);
      setFeaturedNews(featured);
      setArticles(data.filter((n: any) => !n.is_featured));
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
    if (selectedArticle === newsId) {
      setSelectedArticle(null);
    } else {
      setSelectedArticle(newsId);
      if (!comments[newsId]) {
        loadComments(newsId);
      }
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
                <FeaturedNews news={featuredNews} />
                
                {articles.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-serif font-bold mb-4">Другие новости</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {articles.slice(0, 6).map((article) => (
                        <MiniNewsCard
                          key={article.id}
                          news={article}
                          onClick={() => handleArticleClick(article.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <NewsArticle
                  key={article.id}
                  article={article}
                  isExpanded={selectedArticle === article.id}
                  comments={comments[article.id] || []}
                  commentName={commentName}
                  commentText={commentText}
                  relatedNews={articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3)}
                  onToggle={() => handleArticleClick(article.id)}
                  onCommentNameChange={setCommentName}
                  onCommentTextChange={setCommentText}
                  onAddComment={() => handleAddComment(article.id)}
                  onRelatedClick={handleArticleClick}
                />
              ))}
            </div>

            <EventsSection events={events} />
          </>
        )}
      </main>

      <Footer sections={sections} onSectionChange={setActiveSection} />
    </div>
  );
};

export default Index;