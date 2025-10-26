import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SiteHeader } from '@/components/SiteHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { FUNCTIONS_URL } from '@/lib/admin-constants';

interface MemoryArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  year: number;
  decade: string;
  event_date: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
}

const AllMemories = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<MemoryArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<string[]>([]);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(FUNCTIONS_URL.memory);
        if (response.ok) {
          const data = await response.json();
          const published = data.filter((a: MemoryArticle) => a.is_published);
          setArticles(published);
        }

        const weatherResponse = await fetch(FUNCTIONS_URL.weather);
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          setWeather(weatherData);
        }

        const allSections = ['Главная', 'Спорт', 'Культура', 'Экономика', 'Политика', 'Общество'];
        setSections(allSections);
        setLoading(false);
      } catch (error) {
        console.error('Error loading memory articles:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSectionChange = (section: string) => {
    navigate('/');
  };

  const handleArticleClick = (id: number) => {
    navigate(`/memory/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  const pageTitle = 'Город помнит — Историческая хроника';
  const pageDescription = 'Полная коллекция исторических событий города. Листайте страницы прошлого.';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ggkrasnodar.ru/memory" />
      </Helmet>

      <SiteHeader 
        weather={weather}
        sections={sections}
        activeSection=""
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/');
            }}
            className="mb-6 gap-2"
          >
            <Icon name="ArrowLeft" size={16} />
            Вернуться на главную
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-transparent" />
            <Icon name="Clock" size={32} className="text-amber-700" />
            <div className="flex-1 h-1 bg-gradient-to-l from-amber-600 to-transparent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-amber-950 dark:text-amber-100 border-l-4 border-amber-600 pl-4">
            Город помнит
          </h1>
          <p className="text-lg text-muted-foreground font-serif">
            Историческая хроника городских событий — {articles.length} {articles.length === 1 ? 'статья' : articles.length < 5 ? 'статьи' : 'статей'}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Пока нет опубликованных статей</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card 
                key={article.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-background dark:from-amber-950/40 dark:via-orange-950/20 dark:to-background border-2 border-amber-400/40 dark:border-amber-700/40 relative overflow-hidden group"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleArticleClick(article.id);
                }}
              >
                <CardContent className="p-0 relative h-full flex flex-col">
                  {article.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover sepia-[0.4] contrast-110 group-hover:sepia-[0.2] transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
                      
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-4 py-2 border-2 border-amber-400/80">
                        <span className="text-2xl font-serif font-bold text-amber-100 tracking-wider">{article.year}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-300/30">
                      <Icon name="Clock" size={12} className="text-amber-700" />
                      <span className="text-xs text-amber-800 dark:text-amber-400 font-serif uppercase tracking-wide">
                        {article.decade || `${article.year}-е годы`}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-serif font-bold mb-2 leading-tight text-amber-950 dark:text-amber-100 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-serif flex-1 mb-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-amber-300/30">
                      {article.event_date && (
                        <span className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 font-serif">
                          <Icon name="Calendar" size={12} />
                          {new Date(article.event_date).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'short'
                          })}
                        </span>
                      )}
                      
                      <span className="text-xs text-amber-800 dark:text-amber-400 font-serif opacity-0 group-hover:opacity-100 transition-opacity">
                        Читать →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllMemories;
