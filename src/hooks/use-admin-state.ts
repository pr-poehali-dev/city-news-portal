import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FUNCTIONS_URL, ADMIN_CREDENTIALS } from '@/lib/admin-constants';

export const useAdminState = () => {
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
    
    if (!newsForm.title || !newsForm.category || !newsForm.excerpt) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: заголовок, категория и краткое описание',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        ...newsForm,
        author_id: 1,
        status: isDraft ? 'draft' : 'published'
      };
      
      console.log('Sending news:', payload);
      
      const response = await fetch(FUNCTIONS_URL.news, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (response.ok) {
        await loadNews();
        await loadDrafts();
        
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
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось сохранить',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('News submit error:', error);
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
    setEditingNews({
      ...news,
      image_url: news.image_url || '',
      video_url: news.video_url || '',
      read_time: news.read_time || '5 мин',
      is_featured: news.is_featured || false
    });
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
        await loadNews();
        await loadDrafts();
        setEditDialogOpen(false);
        setTimeout(() => setEditingNews(null), 300);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Ошибка',
          description: errorData.error || 'Не удалось обновить',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Edit error:', error);
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
        await loadNews();
        await loadDrafts();
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
        await loadNews();
        await loadDrafts();
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
        await loadNews();
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

  return {
    loading,
    authenticated,
    loginForm,
    setLoginForm,
    editingNews,
    setEditingNews,
    editDialogOpen,
    setEditDialogOpen,
    newsForm,
    setNewsForm,
    eventForm,
    setEventForm,
    newsList,
    draftsList,
    eventsList,
    authorsList,
    authorForm,
    setAuthorForm,
    aboutForm,
    setAboutForm,
    handleLogin,
    handleLogout,
    handleNewsSubmit,
    handleEditNewsOpen,
    handleEditNews,
    handleDeleteNews,
    handlePublishDraft,
    handleSetFeatured,
    handleEventSubmit,
    handleDeleteEvent,
    handleAuthorSubmit,
    handleDeleteAuthor,
    handleAboutSubmit
  };
};