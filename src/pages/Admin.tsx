import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d'
};

const CATEGORIES = [
  'Политика',
  'Экономика',
  'Культура',
  'Спорт',
  'События',
  'О портале',
  'Контакты'
];

const ADMIN_CREDENTIALS = {
  login: 'moskvinkrd',
  password: 'Nikitos0708'
};

const Admin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [editingNews, setEditingNews] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Политика',
    excerpt: '',
    content: '',
    image_url: '',
    video_url: '',
    read_time: '5 мин',
    status: 'published'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: ''
  });

  const [newsList, setNewsList] = useState([]);
  const [draftsList, setDraftsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadNews();
      loadDrafts();
      loadEvents();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.login === ADMIN_CREDENTIALS.login && loginForm.password === ADMIN_CREDENTIALS.password) {
      setAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      toast({
        title: 'Успешно!',
        description: 'Вы вошли в админ-панель'
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный логин или пароль',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('admin_auth');
    window.location.href = '/';
  };

  const loadNews = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.news}?status=published`);
      const data = await response.json();
      setNewsList(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    }
  };

  const loadDrafts = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.news}?status=draft`);
      const data = await response.json();
      setDraftsList(data);
    } catch (error) {
      console.error('Failed to load drafts:', error);
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

  const handleNewsSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.news, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsForm,
          author_id: 1,
          status: isDraft ? 'draft' : 'published'
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: isDraft ? 'Черновик сохранён' : 'Новость опубликована'
        });
        setNewsForm({
          title: '',
          category: 'Политика',
          excerpt: '',
          content: '',
          image_url: '',
          video_url: '',
          read_time: '5 мин',
          status: 'published'
        });
        loadNews();
        loadDrafts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditNews = async () => {
    if (!editingNews) return;
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.news, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNews)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Новость обновлена'
        });
        setEditDialogOpen(false);
        setEditingNews(null);
        loadNews();
        loadDrafts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (newsId: number) => {
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.news}?id=${newsId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Новость удалена'
        });
        loadNews();
        loadDrafts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishDraft = async (draft: any) => {
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.news, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, status: 'published' })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Черновик опубликован'
        });
        loadNews();
        loadDrafts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось опубликовать',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetFeatured = async (newsId: number) => {
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.news, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newsId, is_featured: true })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Новость закреплена в главной'
        });
        loadNews();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось закрепить',
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

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">
              Вход в админ-панель
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Логин</label>
                <Input
                  value={loginForm.login}
                  onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                  required
                  placeholder="Логин"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Пароль</label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  placeholder="Пароль"
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                На сайт
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const NewsCard = ({ news, isDraft = false }: { news: any; isDraft?: boolean }) => (
    <div className="border rounded-lg p-3 hover:bg-muted/50 transition">
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
      <div className="flex gap-2 mt-3">
        {isDraft && (
          <Button 
            size="sm" 
            variant="default"
            onClick={() => handlePublishDraft(news)}
            disabled={loading}
          >
            <Icon name="Upload" size={14} className="mr-1" />
            Опубликовать
          </Button>
        )}
        {!isDraft && (
          <Button 
            size="sm" 
            variant={news.is_featured ? "default" : "secondary"}
            onClick={() => handleSetFeatured(news.id)}
            disabled={loading || news.is_featured}
          >
            <Icon name="Pin" size={14} className="mr-1" />
            {news.is_featured ? 'Главная новость' : 'В главную'}
          </Button>
        )}
        <Dialog open={editDialogOpen && editingNews?.id === news.id} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setEditingNews({
                ...news,
                image_url: news.image_url || '',
                video_url: news.video_url || '',
                read_time: news.read_time || '5 мин'
              })}
            >
              <Icon name="Edit" size={14} className="mr-1" />
              Редактировать
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Редактировать новость</DialogTitle>
            </DialogHeader>
            {editingNews && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Заголовок</label>
                  <Input
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <Select
                    value={editingNews.category}
                    onValueChange={(value) => setEditingNews({ ...editingNews, category: value })}
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
                  <label className="text-sm font-medium mb-2 block">Краткое описание</label>
                  <Textarea
                    value={editingNews.excerpt}
                    onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Полный текст</label>
                  <Textarea
                    value={editingNews.content || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ссылка на изображение</label>
                  <Input
                    value={editingNews.image_url || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ссылка на видео (YouTube, Rutube)</label>
                  <Input
                    value={editingNews.video_url || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, video_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Время чтения</label>
                  <Input
                    value={editingNews.read_time}
                    onChange={(e) => setEditingNews({ ...editingNews, read_time: e.target.value })}
                  />
                </div>
                <Button onClick={handleEditNews} className="w-full" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="sm" 
              variant="destructive"
              disabled={loading}
            >
              <Icon name="Trash2" size={14} className="mr-1" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Новость будет удалена навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteNews(news.id)}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                На сайт
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="news">Новости ({newsList.length})</TabsTrigger>
            <TabsTrigger value="drafts">Черновики ({draftsList.length})</TabsTrigger>
            <TabsTrigger value="events">События ({eventsList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить новость</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleNewsSubmit(e, false)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Заголовок</label>
                      <Input
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        required
                        placeholder="Заголовок новости"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Категория (тег)</label>
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
                      <label className="text-sm font-medium mb-2 block">Краткое описание</label>
                      <Textarea
                        value={newsForm.excerpt}
                        onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                        required
                        placeholder="Краткое описание для карточки"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Полный текст</label>
                      <Textarea
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        placeholder="Полный текст новости"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Ссылка на изображение</label>
                      <Input
                        value={newsForm.image_url}
                        onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Ссылка на видео (YouTube, Rutube)</label>
                      <Input
                        value={newsForm.video_url}
                        onChange={(e) => setNewsForm({ ...newsForm, video_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Время чтения</label>
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

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? 'Публикация...' : 'Опубликовать'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={(e) => handleNewsSubmit(e as any, true)}
                        disabled={loading}
                      >
                        <Icon name="Save" size={16} className="mr-2" />
                        В черновики
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Опубликованные ({newsList.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {newsList.map((news: any) => (
                      <NewsCard key={news.id} news={news} />
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

          <TabsContent value="drafts">
            <Card>
              <CardHeader>
                <CardTitle>Черновики ({draftsList.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {draftsList.map((draft: any) => (
                    <NewsCard key={draft.id} news={draft} isDraft />
                  ))}
                  {draftsList.length === 0 && (
                    <p className="col-span-2 text-center text-muted-foreground py-12">
                      Черновиков пока нет
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
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
                      <label className="text-sm font-medium mb-2 block">Название события</label>
                      <Input
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                        placeholder="Название события"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Описание</label>
                      <Textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Описание события"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Дата и время</label>
                      <Input
                        type="datetime-local"
                        value={eventForm.event_date}
                        onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Место проведения</label>
                      <Input
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        placeholder="Адрес или место"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Ссылка на изображение</label>
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