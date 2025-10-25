import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SiteHeader } from '@/components/SiteHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

const MemoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<MemoryArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<string[]>([]);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(FUNCTIONS_URL.memory);
        if (response.ok) {
          const data = await response.json();
          const currentArticle = data.find((a: MemoryArticle) => a.id === Number(id));
          setArticle(currentArticle || null);
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
        console.error('Error loading memory article:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSectionChange = (section: string) => {
    navigate('/');
  };

  const renderContentWithImages = (content: string) => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = imageRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const alt = match[1] || 'Изображение';
      const imageUrl = match[2];
      
      parts.push(
        <img 
          key={key++}
          src={imageUrl} 
          alt={alt}
          className="w-full max-w-2xl mx-auto rounded-lg my-4 object-contain"
          style={{ maxHeight: '500px' }}
        />
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts;
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

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  const pageTitle = `${article.title} — Город говорит`;
  const pageDescription = article.excerpt?.substring(0, 155) || '';
  const pageImage = article.image_url || 'https://cdn.poehali.dev/intertnal/img/og.png';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://ggkrasnodar.ru/memory/${id}`} />
      </Helmet>

      <SiteHeader 
        weather={weather}
        sections={sections}
        activeSection=""
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <Icon name="ArrowLeft" size={16} />
          Вернуться на главную
        </Button>

        <Card className="overflow-hidden bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-background dark:from-amber-950/40 dark:via-orange-950/20 dark:to-background border-4 border-double border-amber-400/60 dark:border-amber-700/60">
          {article.image_url && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover sepia-[0.4] contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
              <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm px-6 py-3 border-2 border-amber-400/80">
                <span className="text-4xl font-serif font-bold text-amber-100 tracking-wider">{article.year}</span>
              </div>
            </div>
          )}
          
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-amber-300/30">
              <div className="w-12 h-px bg-amber-600" />
              <Icon name="Clock" size={16} className="text-amber-700" />
              <span className="text-sm text-amber-800 dark:text-amber-400 font-serif uppercase tracking-widest">
                {article.decade || `${article.year}-е годы`}
              </span>
              <div className="flex-1 h-px bg-amber-600" />
            </div>

            <h1 className="text-4xl font-serif font-bold mb-6 leading-tight text-amber-950 dark:text-amber-100 border-l-4 border-amber-600 pl-4">
              {article.title}
            </h1>

            {article.event_date && (
              <div className="flex items-center gap-2 mb-6 text-amber-700 dark:text-amber-400">
                <Icon name="Calendar" size={16} />
                <span className="text-sm font-serif italic">
                  {new Date(article.event_date).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            )}

            <div className="mb-6 p-4 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-600 rounded">
              <p className="text-lg leading-relaxed font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:mt-1">
                {article.excerpt}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="prose max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {renderContentWithImages(article.content)}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                К списку статей
              </Button>
              
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Icon name="BookOpen" size={14} className="text-amber-600" />
                Город помнит
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemoryPage;
