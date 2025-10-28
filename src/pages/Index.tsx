import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { NewsTicker } from '@/components/NewsTicker';
import { SEO } from '@/components/SEO';
import { SiteHeader } from '@/components/SiteHeader';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { LatestNewsGrid } from '@/components/LatestNewsGrid';
import { EventsSection } from '@/components/EventsSection';
import { SocialSubscribe } from '@/components/SocialSubscribe';
import { Footer } from '@/components/Footer';
import { PlacesSection } from '@/components/PlacesSection';
import { MemorySection } from '@/components/MemorySection';
import { PartnersSection } from '@/components/PartnersSection';
import { SVOSection } from '@/components/SVOSection';
import { YouthNotesSection } from '@/components/YouthNotesSection';
import { ShowbizSection } from '@/components/home/ShowbizSection';


const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d',
  weather: 'https://functions.poehali.dev/5531fc0c-ecba-421c-bfb4-245613816060',
  comments: 'https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5',
  cityPlaces: 'https://functions.poehali.dev/5db1b661-abf3-4bcb-8e1f-d01437219788',
  memory: 'https://functions.poehali.dev/524497f7-1b8d-4d18-9293-548392f10987',
  kudagoEvents: 'https://functions.poehali.dev/ab80cd05-8ada-45de-8a5f-dd7debe04ea3',
  syncKudago: 'https://functions.poehali.dev/9b3befac-d5bd-4a98-8d2b-f45edc14eb56',
  youthNotes: 'https://functions.poehali.dev/97a5ec9d-d662-4652-be23-350205ec6759'
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
  const [youthNotes, setYouthNotes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('Главная');
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [topThreeNews, setTopThreeNews] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [svoNews, setSvoNews] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const newsCategories = ['Политика', 'Экономика', 'Культура', 'Спорт', 'События'];

  const sections = [
    'Главная',
    'СВО',
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
    loadSVONews();
    syncKudagoEvents();
    loadEvents();
    loadWeather();
    loadLatestForTicker();
    loadCityPlaces();
    loadMemoryArticles();
    loadYouthNotes();
    
    const savedLikes = localStorage.getItem('likedArticles');
    if (savedLikes) {
      setLikedArticles(new Set(JSON.parse(savedLikes)));
    }
    
    const interval = setInterval(() => {
      loadLatestForTicker();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSection === 'СВО') {
      loadSVONews();
    } else if (activeSection !== 'Главная') {
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
      if (!response.ok) {
        console.error('Failed to fetch news:', response.status);
        return;
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Invalid news data format');
        return;
      }
      
      const filteredData = data.filter((article: any) => {
        const isSVO = article.tags && Array.isArray(article.tags) && article.tags.includes('СВО');
        const isShowbiz = article.is_showbiz === true;
        return !isSVO && !isShowbiz;
      });
      
      const sortedData = filteredData.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      const top3 = sortedData.slice(0, 3);
      setTopThreeNews(top3);
      setFeaturedNews(top3[0]);
      setArticles(sortedData);
    } catch (error) {
      console.error('Failed to load news:', error);
      setArticles([]);
      setTopThreeNews([]);
    }
  };

  const loadSVONews = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.news);
      if (!response.ok) {
        console.error('Failed to fetch news for SVO:', response.status);
        setSvoNews([]);
        return;
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const svoFiltered = data.filter((article: any) => 
          article.tags && Array.isArray(article.tags) && article.tags.includes('СВО')
        );
        const sortedData = svoFiltered.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setSvoNews(sortedData);
        console.log('SVO news loaded:', sortedData.length, 'items');
      }
    } catch (error) {
      console.error('Failed to load SVO news:', error);
      setSvoNews([]);
    }
  };

  const loadLatestForTicker = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.news);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setLatestNews(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load latest news:', error);
      setLatestNews([]);
    }
  };

  const loadCityPlaces = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setCityPlaces(data.filter((p: any) => p.is_published));
      }
    } catch (error) {
      console.error('Failed to load city places:', error);
      setCityPlaces([]);
    }
  };

  const loadMemoryArticles = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.memory);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setMemoryArticles(data);
      }
    } catch (error) {
      console.error('Failed to load memory articles:', error);
      setMemoryArticles([]);
    }
  };

  const loadYouthNotes = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.youthNotes);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setYouthNotes(data);
      }
    } catch (error) {
      console.error('Failed to load youth notes:', error);
      setYouthNotes([]);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.kudagoEvents);
      if (!response.ok) return;
      const data = await response.json();
      setEvents(data?.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    }
  };

  const loadWeather = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.weather);
      if (!response.ok) return;
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
      setWeather(null);
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

  const handleSearch = (query: string) => {
    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    const results = articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content?.toLowerCase().includes(lowerQuery) ||
      article.excerpt?.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(results);
    setActiveSection('Поиск');
  };

  const getSectionSEO = () => {
    const baseUrl = 'https://ggkrasnodar.ru/';
    
    switch (activeSection) {
      case 'СВО':
        return {
          title: 'СВО: последние новости специальной военной операции в Краснодаре',
          description: 'Актуальные новости СВО, помощь участникам специальной военной операции, благотворительный фонд поддержки. Мы поддерживаем наших.',
          url: `${baseUrl}#svo`
        };
      case 'Политика':
        return {
          title: 'Политика Краснодара — последние новости',
          description: 'Все о политической жизни Краснодара: решения властей, городские инициативы, общественная деятельность.',
          url: `${baseUrl}#politika`
        };
      case 'Экономика':
        return {
          title: 'Экономика Краснодара — бизнес и финансы',
          description: 'Экономические новости Краснодара: бизнес, инвестиции, развитие города, финансовые показатели.',
          url: `${baseUrl}#ekonomika`
        };
      case 'Культура':
        return {
          title: 'Культура Краснодара — события и новости',
          description: 'Культурная жизнь Краснодара: выставки, концерты, театральные премьеры, фестивали и городские события.',
          url: `${baseUrl}#kultura`
        };
      case 'Спорт':
        return {
          title: 'Спорт в Краснодаре — новости и события',
          description: 'Спортивные новости Краснодара: ФК Краснодар, городские соревнования, достижения спортсменов.',
          url: `${baseUrl}#sport`
        };
      case 'События':
        return {
          title: 'События в Краснодаре — куда сходить сегодня',
          description: 'Афиша Краснодара: концерты, выставки, фестивали, спектакли. Все городские события и мероприятия.',
          url: `${baseUrl}#sobytiya`
        };
      default:
        return {
          title: 'Город говорит — новостной портал Краснодара',
          description: 'Актуальные новости Краснодара: политика, экономика, культура, спорт, СВО. Читайте последние события города каждый день.',
          url: baseUrl
        };
    }
  };

  const seoData = getSectionSEO();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        url={seoData.url}
      />
      <Helmet>
        <link rel="canonical" href={seoData.url} />
      </Helmet>

      <SiteHeader 
        weather={weather}
        sections={sections}
        activeSection={activeSection === 'Поиск' ? 'Главная' : activeSection}
        onSectionChange={handleSectionChange}
        onSearch={handleSearch}
      />

      <NewsTicker latestNews={latestNews} />

      <main className="container mx-auto px-4 py-8">
        {articles.length === 0 && !topThreeNews[0] ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Загрузка новостей...</p>
          </div>
        ) : (
          <>
            {activeSection === 'Поиск' ? (
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-serif mb-8 text-foreground">
                  Результаты поиска ({searchResults.length})
                </h2>
                {searchResults.length > 0 ? (
                  <LatestNewsGrid
                    news={searchResults}
                    onNewsClick={handleArticleClick}
                    limit={24}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Ничего не найдено</p>
                    <p className="text-muted-foreground text-sm mt-2">Попробуйте изменить запрос</p>
                  </div>
                )}
              </div>
            ) : activeSection === 'Главная' ? (
              <>
                <HeroSection
                  mainNews={topThreeNews[0]}
                  sideNews={topThreeNews.slice(1)}
                  onNewsClick={handleArticleClick}
                />

                <CategoryGrid
                  categories={newsCategories}
                  articles={articles}
                  onNewsClick={handleArticleClick}
                  onCategoryClick={(cat) => setActiveSection(cat)}
                />

                <LatestNewsGrid
                  news={articles.slice(3, 15)}
                  onNewsClick={handleArticleClick}
                  limit={12}
                />
              </>
            ) : activeSection === 'СВО' ? (
              <SVOSection
                news={svoNews}
                onNewsClick={handleArticleClick}
              />
            ) : (
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-serif mb-8 text-foreground">{activeSection}</h2>
                <LatestNewsGrid
                  news={articles}
                  onNewsClick={handleArticleClick}
                  limit={24}
                />
              </div>
            )}

            {activeSection === 'Главная' && (
              <>
                <SVOSection
                  news={svoNews}
                  onNewsClick={handleArticleClick}
                />

                <ShowbizSection />

                <PlacesSection
                  cityPlaces={cityPlaces}
                  selectedCategory={selectedCategory}
                  showAllPlaces={showAllPlaces}
                  categoryColors={categoryColors}
                  onCategorySelect={setSelectedCategory}
                  onShowAllToggle={() => setShowAllPlaces(!showAllPlaces)}
                />

                <YouthNotesSection notes={youthNotes} />

                <MemorySection
                  articles={memoryArticles}
                  onArticleClick={(id) => navigate(`/memory/${id}`)}
                />

                <EventsSection events={events} />

                <PartnersSection />
              </>
            )}
          </>
        )}
      </main>

      {activeSection === 'Главная' && <SocialSubscribe />}

      <Footer 
        sections={sections} 
        onSectionChange={handleSectionChange} 
      />
    </div>
  );
};

export default Index;