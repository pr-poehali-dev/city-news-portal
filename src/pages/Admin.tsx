import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d'
};

const CATEGORIES = [
  'Главная',
  'Новости',
  'Политика',
  'Экономика',
  'Культура',
  'Спорт',
  'События'
];

const Admin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Новости',
    excerpt: '',
    content: '',
    image_url: '',
    read_time: '5 мин'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: ''
  });

  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    loadNews();
    loadEvents();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.news);
      const data = await response.json();
      setNewsList(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.events);
      const data = await response.json();
      setEventsList(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.news, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsForm,
          author_id: 1
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Новость добавлена'
        });
        setNewsForm({
          title: '',
          category: 'Новости',
          excerpt: '',
          content: '',
          image_url: '',
          read_time: '5 мин'
        });
        loadNews();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить новость',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.events, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Событие добавлено'
        });
        setEventForm({
          title: '',
          description: '',
          event_date: '',
          location: '',
          image_url: ''
        });
        loadEvents();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить событие',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary font-serif">
                Админ-панель
              </h1>
              <p className="text-sm text-muted-foreground">Город говорит: Краснодар</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              На сайт
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить новость</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Заголовок
                      </label>
                      <Input
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        required
                        placeholder="Заголовок новости"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Категория (тег)
                      </label>
                      <Select
                        value={newsForm.category}
                        onValueChange={(value) => setNewsForm({ ...newsForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Краткое описание
                      </label>
                      <Textarea
                        value={newsForm.excerpt}
                        onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                        required
                        placeholder="Краткое описание для карточки"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Полный текст
                      </label>
                      <Textarea
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        placeholder="Полный текст новости"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Ссылка на изображение
                      </label>
                      <Input
                        value={newsForm.image_url}
                        onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Время чтения
                      </label>
                      <Input
                        value={newsForm.read_time}
                        onChange={(e) => setNewsForm({ ...newsForm, read_time: e.target.value })}
                        placeholder="5 мин"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      <Icon name="User" size={16} className="inline mr-2" />
                      Автор: <strong>Никита Москвин</strong>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Добавление...' : 'Опубликовать новость'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Список новостей ({newsList.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {newsList.map((news: any) => (
                      <div key={news.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <Badge className="mb-2">{news.category}</Badge>
                            <h3 className="font-semibold text-sm mb-1">{news.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {news.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Icon name="User" size={12} />
                              {news.author_name || 'Никита Москвин'}
                              <span>•</span>
                              {new Date(news.published_at).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          {news.image_url && (
                            <img 
                              src={news.image_url} 
                              alt="" 
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {newsList.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Новостей пока нет
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить событие</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Название события
                      </label>
                      <Input
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                        placeholder="Название события"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Описание
                      </label>
                      <Textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Описание события"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Дата и время
                      </label>
                      <Input
                        type="datetime-local"
                        value={eventForm.event_date}
                        onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Место проведения
                      </label>
                      <Input
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        placeholder="Адрес или место"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Ссылка на изображение
                      </label>
                      <Input
                        value={eventForm.image_url}
                        onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Добавление...' : 'Добавить событие'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Афиша ({eventsList.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {eventsList.map((event: any) => (
                      <div key={event.id} className="border rounded-lg p-3 hover:bg-muted/50 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {event.description}
                            </p>
                            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Icon name="Calendar" size={12} />
                                {new Date(event.event_date).toLocaleString('ru-RU')}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <Icon name="MapPin" size={12} />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </div>
                          {event.image_url && (
                            <img 
                              src={event.image_url} 
                              alt="" 
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {eventsList.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        События пока не добавлены
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
