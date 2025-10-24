import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsForm } from '@/components/admin/NewsForm';
import { NewsCard } from '@/components/admin/NewsCard';
import { EventForm } from '@/components/admin/EventForm';
import { EventCard } from '@/components/admin/EventCard';
import { AuthorForm } from '@/components/admin/AuthorForm';
import { AuthorCard } from '@/components/admin/AuthorCard';
import { AboutForm } from '@/components/admin/AboutForm';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d',
  settings: 'https://functions.poehali.dev/3df5293f-c779-41ac-9c87-49466251f502'
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
  const [authorsList, setAuthorsList] = useState([]);
  
  const [authorForm, setAuthorForm] = useState({
    name: '',
    position: '',
    bio: '',
    photo_url: ''
  });

  const [aboutForm, setAboutForm] = useState({
    title: '',
    content: ''
  });

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
      loadAuthors();
      loadAbout();
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

  const handleDeleteEvent = async (eventId: number) => {
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.events}?id=${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Событие удалено'
        });
        loadEvents();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить событие',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=authors`);
      const data = await response.json();
      setAuthorsList(data);
    } catch (error) {
      console.error('Failed to load authors:', error);
    }
  };

  const loadAbout = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=about`);
      const data = await response.json();
      if (data.title) {
        setAboutForm({ title: data.title, content: data.content });
      }
    } catch (error) {
      console.error('Failed to load about:', error);
    }
  };

  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authorForm)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Автор добавлен'
        });
        setAuthorForm({ name: '', position: '', bio: '', photo_url: '' });
        loadAuthors();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить автора',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (authorId: number) => {
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=authors&id=${authorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Автор удален'
        });
        loadAuthors();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить автора',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAboutSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutForm)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Раздел "О портале" обновлен'
        });
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

  if (!authenticated) {
    return (
      <LoginForm
        loginForm={loginForm}
        loading={loading}
        onLoginChange={(field, value) => setLoginForm({ ...loginForm, [field]: value })}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="news">Новости ({newsList.length})</TabsTrigger>
            <TabsTrigger value="drafts">Черновики ({draftsList.length})</TabsTrigger>
            <TabsTrigger value="events">События ({eventsList.length})</TabsTrigger>
            <TabsTrigger value="authors">Авторы ({authorsList.length})</TabsTrigger>
            <TabsTrigger value="about">О портале</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="grid lg:grid-cols-2 gap-8">
              <NewsForm
                newsForm={newsForm}
                categories={CATEGORIES}
                loading={loading}
                onFormChange={(field, value) => setNewsForm({ ...newsForm, [field]: value })}
                onSubmit={handleNewsSubmit}
              />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Опубликованные новости</h3>
                {newsList.length === 0 ? (
                  <p className="text-muted-foreground">Новостей пока нет</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {newsList.map((news: any) => (
                      <NewsCard
                        key={news.id}
                        news={news}
                        isDraft={false}
                        loading={loading}
                        editingNews={editingNews}
                        editDialogOpen={editDialogOpen}
                        categories={CATEGORIES}
                        onSetFeatured={() => handleSetFeatured(news.id)}
                        onEdit={setEditingNews}
                        onEditDialogChange={setEditDialogOpen}
                        onEditingNewsChange={setEditingNews}
                        onSaveEdit={handleEditNews}
                        onDelete={() => handleDeleteNews(news.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drafts">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Черновики</h3>
              {draftsList.length === 0 ? (
                <p className="text-muted-foreground">Черновиков пока нет</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {draftsList.map((draft: any) => (
                    <NewsCard
                      key={draft.id}
                      news={draft}
                      isDraft={true}
                      loading={loading}
                      editingNews={editingNews}
                      editDialogOpen={editDialogOpen}
                      categories={CATEGORIES}
                      onPublishDraft={() => handlePublishDraft(draft)}
                      onEdit={setEditingNews}
                      onEditDialogChange={setEditDialogOpen}
                      onEditingNewsChange={setEditingNews}
                      onSaveEdit={handleEditNews}
                      onDelete={() => handleDeleteNews(draft.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid lg:grid-cols-2 gap-8">
              <EventForm
                eventForm={eventForm}
                loading={loading}
                onFormChange={(field, value) => setEventForm({ ...eventForm, [field]: value })}
                onSubmit={handleEventSubmit}
              />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Список событий</h3>
                {eventsList.length === 0 ? (
                  <p className="text-muted-foreground">События пока не добавлены</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {eventsList.map((event: any) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        loading={loading}
                        onDelete={() => handleDeleteEvent(event.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authors">
            <div className="grid lg:grid-cols-2 gap-8">
              <AuthorForm
                authorForm={authorForm}
                loading={loading}
                onFormChange={(field, value) => setAuthorForm({ ...authorForm, [field]: value })}
                onSubmit={handleAuthorSubmit}
              />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Список авторов</h3>
                {authorsList.length === 0 ? (
                  <p className="text-muted-foreground">Авторы пока не добавлены</p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {authorsList.map((author: any) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        loading={loading}
                        onDelete={() => handleDeleteAuthor(author.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-3xl mx-auto">
              <AboutForm
                aboutForm={aboutForm}
                loading={loading}
                onFormChange={(field, value) => setAboutForm({ ...aboutForm, [field]: value })}
                onSubmit={handleAboutSubmit}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;