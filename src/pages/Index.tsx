import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { FeaturedNews } from '@/components/FeaturedNews';
import { EventsSection } from '@/components/EventsSection';
import { SocialSubscribe } from '@/components/SocialSubscribe';
import { MiniNewsCard } from '@/components/MiniNewsCard';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/Footer';
import { NewsSection } from '@/components/NewsSection';
import { PlacesSection } from '@/components/PlacesSection';
import { MemorySection } from '@/components/MemorySection';
import { CategoryPreview } from '@/components/CategoryPreview';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d',
  weather: 'https://functions.poehali.dev/5531fc0c-ecba-421c-bfb4-245613816060',
  comments: 'https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5',
  cityPlaces: 'https://functions.poehali.dev/5db1b661-abf3-4bcb-8e1f-d01437219788',
  memory: 'https://functions.poehali.dev/524497f7-1b8d-4d18-9293-548392f10987',
  kudagoEvents: 'https://functions.poehali.dev/ab80cd05-8ada-45de-8a5f-dd7debe04ea3',
  syncKudago: 'https://functions.poehali.dev/9b3befac-d5bd-4a98-8d2b-f45edc14eb56'
};

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

const Index = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [featuredNews, setFeaturedNews] = useState<any>(null);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [cityPlaces, setCityPlaces] = useState<any[]>([]);
  const [memoryArticles, setMemoryArticles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('Главная');
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [topThreeNews, setTopThreeNews] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const newsCategories = ['Политика', 'Экономика', 'Культура', 'Спорт', 'События'];

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

  const handleSectionChange = (section: string) => {
    if (section === 'О портале') {
      navigate('/about');
    } else if (section === 'Контакты') {
      navigate('/contacts');
    } else {
      setActiveSection(section);
    }
  };

  useEffect(() => {
    loadNews();
    syncKudagoEvents();
    loadEvents();
    loadWeather();
    loadLatestForTicker();
    loadCityPlaces();
    loadMemoryArticles();
    
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
    const categoriesWithNews = newsCategories.filter(cat => 
      articles.some(a => a.category === cat)
    );
    setAvailableCategories(categoriesWithNews);
    if (categoriesWithNews.length > 0 && currentCategoryIndex >= categoriesWithNews.length) {
      setCurrentCategoryIndex(0);
    }
  }, [articles]);

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

  const syncKudagoEvents = async () => {
    try {
      await fetch(FUNCTIONS_URL.syncKudago);
    } catch (error) {
      console.error('Failed to sync KudaGo events:', error);
    }
  };

  const loadNews = async (category?: string) => {
    try {
      const url = category ? `${FUNCTIONS_URL.news}?category=${encodeURIComponent(category)}` : FUNCTIONS_URL.news;
      const response = await fetch(url);
      const data = await response.json();
      
      const sortedData = data.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const top3 = sortedData.slice(0, 3);
      setTopThreeNews(top3);
      setFeaturedNews(top3[0]);
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

  const loadCityPlaces = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces);
      const data = await response.json();
      setCityPlaces(data.filter((p: any) => p.is_published));
    } catch (error) {
      console.error('Failed to load city places:', error);
    }
  };

  const loadMemoryArticles = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.memory);
      const data = await response.json();
      setMemoryArticles(data.filter((a: any) => a.is_published));
    } catch (error) {
      console.error('Failed to load memory articles:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.kudagoEvents);
      const data = await response.json();
      setEvents(data.events || []);
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

  const handleCategoryChange = (direction: 'prev' | 'next') => {
    setCurrentCategoryIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % availableCategories.length;
      } else {
        return prev === 0 ? availableCategories.length - 1 : prev - 1;
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Город говорит — новостной портал Краснодара</title>
        <meta name="description" content="Актуальные новости Краснодара: политика, экономика, культура, спорт. Читайте последние события города каждый день." />
        <link rel="canonical" href="https://ggkrasnodar.ru/" />
      </Helmet>

      <NewsTicker latestNews={latestNews} />
      
      <SiteHeader 
        weather={weather}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 py-8">
        {articles.length === 0 && !featuredNews ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Загрузка новостей...</p>
          </div>
        ) : (
          <>
            {featuredNews && (
              <FeaturedNews
                news={featuredNews}
                currentIndex={currentFeaturedIndex}
                totalCount={topThreeNews.length}
                onNavigate={(direction) => {
                  setCurrentFeaturedIndex(prev => {
                    const newIndex = direction === 'next' 
                      ? (prev + 1) % topThreeNews.length
                      : prev === 0 ? topThreeNews.length - 1 : prev - 1;
                    setFeaturedNews(topThreeNews[newIndex]);
                    return newIndex;
                  });
                }}
                onClick={() => handleArticleClick(featuredNews.id)}
              />
            )}

            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Последние новости</h2>
              <div className="grid gap-6">
                {articles.slice(3, 9).map((article) => (
                  <MiniNewsCard
                    key={article.id}
                    news={article}
                    onClick={() => handleArticleClick(article.id)}
                    onLike={() => handleLike(article.id)}
                    isLiked={likedArticles.has(article.id)}
                  />
                ))}
              </div>
            </div>

            <PlacesSection
              cityPlaces={cityPlaces}
              selectedCategory={selectedCategory}
              showAllPlaces={showAllPlaces}
              categoryColors={categoryColors}
              onCategorySelect={setSelectedCategory}
              onShowAllToggle={() => setShowAllPlaces(!showAllPlaces)}
            />

            <Separator className="my-12" />

            <MemorySection
              articles={memoryArticles}
              onArticleClick={handleArticleClick}
            />

            <Separator className="my-12" />

            <EventsSection events={events} />

            <Separator className="my-12" />

            <NewsSection
              articles={articles}
              newsCategories={newsCategories}
              currentCategoryIndex={currentCategoryIndex}
              availableCategories={availableCategories}
              onCategoryChange={handleCategoryChange}
              onArticleClick={handleArticleClick}
              onLike={handleLike}
              likedArticles={likedArticles}
            />
          </>
        )}
      </main>

      <SocialSubscribe />

      <Footer 
        sections={sections} 
        onSectionChange={handleSectionChange} 
      />
    </div>
  );
};

export default Index;