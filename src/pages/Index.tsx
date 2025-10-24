import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

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
  const [events, setEvents] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [activeSection, setActiveSection] = useState('Главная');

  const sections = [
    'Главная',
    'Новости',
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
      setArticles(data);
    } catch (error) {
      console.error('Failed to load news:', error);
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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary font-serif">
                Город говорит
              </h1>
              <p className="text-sm text-muted-foreground font-medium">Краснодар</p>
            </div>
            <div className="flex items-center gap-4">
              {weather && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3 flex items-center gap-3">
                    <img 
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather.description}
                      className="w-12 h-12"
                    />
                    <div>
                      <div className="text-2xl font-bold">{weather.temp}°C</div>
                      <div className="text-xs text-muted-foreground">{weather.description}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button variant="ghost" size="sm">
                <Icon name="Search" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/admin'}
              >
                Админка
              </Button>
            </div>
          </div>
          
          <nav className="flex gap-6 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section
                    ? 'text-primary border-b-2 border-primary pb-2'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {articles.length === 0 ? (
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
          <div className="grid gap-8 lg:grid-cols-2">
            {articles.map((article, index) => (
              <Card 
                key={article.id} 
                className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer animate-fade-in ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`grid ${index === 0 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-0`}>
                  <div className="relative overflow-hidden group">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          index === 0 ? 'h-full min-h-[400px]' : 'h-64'
                        }`}
                      />
                    ) : (
                      <div className={`w-full bg-primary/10 flex items-center justify-center ${
                        index === 0 ? 'h-full min-h-[400px]' : 'h-64'
                      }`}>
                        <Icon name="Image" size={48} className="text-primary/30" />
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      {article.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6 flex flex-col justify-between">
                    <div>
                      <h2 className={`font-serif font-bold mb-3 hover:text-primary transition-colors ${
                        index === 0 ? 'text-3xl' : 'text-2xl'
                      }`}>
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={16} />
                          {article.author_name || 'Никита Москвин'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={16} />
                          {new Date(article.published_at).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={16} />
                          {article.read_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="MessageSquare" size={16} />
                          {comments[article.id]?.length || 0}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleArticleClick(article.id)}
                        >
                          {selectedArticle === article.id ? 'Скрыть' : 'Читать и обсудить'}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Icon name="Share2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {selectedArticle === article.id && (
                  <div className="border-t bg-muted/30 animate-accordion-down">
                    <div className="p-6">
                      {article.content && (
                        <>
                          <div className="prose prose-sm max-w-none mb-6 text-foreground">
                            {article.content}
                          </div>
                          <Separator className="my-6" />
                        </>
                      )}

                      <h3 className="text-xl font-serif font-bold mb-4">
                        Комментарии ({comments[article.id]?.length || 0})
                      </h3>

                      <div className="space-y-4 mb-6">
                        {comments[article.id]?.map((comment) => (
                          <div key={comment.id} className="bg-white p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon name="User" size={16} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{comment.author_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleString('ru-RU')}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm ml-10">{comment.text}</p>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-3">
                        <h4 className="font-semibold">Оставить комментарий</h4>
                        <Input
                          placeholder="Ваше имя"
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                        />
                        <Textarea
                          placeholder="Ваш комментарий..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={3}
                        />
                        <Button 
                          onClick={() => handleAddComment(article.id)}
                          className="w-full"
                        >
                          Отправить комментарий
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {events.length > 0 && (
          <>
            <Separator className="my-12" />
            
            <section>
              <h2 className="text-3xl font-serif font-bold mb-6 text-primary">
                Афиша событий
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {event.image_url ? (
                      <img 
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-secondary/20 flex items-center justify-center">
                        <Icon name="Calendar" size={48} className="text-secondary/40" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-serif font-bold text-lg mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-primary">
                          <Icon name="Calendar" size={16} />
                          {new Date(event.event_date).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon name="MapPin" size={16} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bg-foreground text-background py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">Город говорит: Краснодар</h3>
              <p className="text-sm opacity-80">
                Актуальные новости вашего города. Будьте в курсе событий вместе с нами.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Новости</li>
                <li>Политика</li>
                <li>Экономика</li>
                <li>Культура</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Email: info@gorodgovorit.ru</li>
                <li>Телефон: +7 (XXX) XXX-XX-XX</li>
                <li>Краснодар</li>
              </ul>
            </div>
          </div>
          <Separator className="my-6 opacity-20" />
          <p className="text-center text-sm opacity-60">
            © 2025 Город говорит: Краснодар. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
