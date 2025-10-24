import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { NewsManagement } from '@/components/admin/NewsManagement';
import { EventsManagement } from '@/components/admin/EventsManagement';
import { AuthorsManagement } from '@/components/admin/AuthorsManagement';
import { SettingsManagement } from '@/components/admin/SettingsManagement';
import { NewsEditDialog } from '@/components/admin/NewsEditDialog';

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

  const loadAuthors = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=authors`);
      const data = await response.json();
      setAuthorsList(data || []);
    } catch (error) {
      console.error('Failed to load authors:', error);
    }
  };

  const loadAbout = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.settings}?resource=about`);
      const data = await response.json();
      if (data) {
        setAboutForm({
          title: data.title || '',
          content: data.content || ''
        });
      }
    } catch (error) {
      console.error('Failed to load about:', error);
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

  const handleEditNewsOpen = (news: any) => {
    setEditingNews(news);
    setEditDialogOpen(true);
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
        description: 'Не удалось удалить',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
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
        setAuthorForm({
          name: '',
          position: '',
          bio: '',
          photo_url: ''
        });
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
          description: 'Автор удалён'
        });
        loadAuthors();
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

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          description: 'Информация сохранена'
        });
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

  if (!authenticated) {
    return (
      <LoginForm
        form={loginForm}
        setForm={setLoginForm}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
            <TabsTrigger value="authors">Авторы</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <NewsManagement
              newsForm={newsForm}
              setNewsForm={setNewsForm}
              newsList={newsList}
              draftsList={draftsList}
              categories={CATEGORIES}
              loading={loading}
              onNewsSubmit={handleNewsSubmit}
              onDeleteNews={handleDeleteNews}
              onSetFeatured={handleSetFeatured}
              onPublishDraft={handlePublishDraft}
              onEditNews={handleEditNewsOpen}
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsManagement
              eventForm={eventForm}
              setEventForm={setEventForm}
              eventsList={eventsList}
              loading={loading}
              onEventSubmit={handleEventSubmit}
              onDeleteEvent={handleDeleteEvent}
            />
          </TabsContent>

          <TabsContent value="authors">
            <AuthorsManagement
              authorForm={authorForm}
              setAuthorForm={setAuthorForm}
              authorsList={authorsList}
              loading={loading}
              onAuthorSubmit={handleAuthorSubmit}
              onDeleteAuthor={handleDeleteAuthor}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement
              aboutForm={aboutForm}
              setAboutForm={setAboutForm}
              loading={loading}
              onAboutSubmit={handleAboutSubmit}
            />
          </TabsContent>
        </Tabs>
      </main>

      <NewsEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        news={editingNews}
        setNews={setEditingNews}
        categories={CATEGORIES}
        loading={loading}
        onSave={handleEditNews}
      />
    </div>
  );
};

export default Admin;