import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FUNCTIONS_URL } from '@/lib/admin-constants';

export const useAdminState = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
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
    status: 'published',
    publish_telegram: true
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: ''
  });

  const [placeForm, setPlaceForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Город завтракает',
    latitude: 45.0355,
    longitude: 38.9753,
    address: '',
    image_url: '',
    is_published: false,
    is_featured: false
  });

  const [memoryForm, setMemoryForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    year: '',
    decade: '',
    event_date: '',
    image_url: '',
    is_published: false
  });

  const [newsList, setNewsList] = useState([]);
  const [draftsList, setDraftsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [placesList, setPlacesList] = useState([]);
  const [memoryList, setMemoryList] = useState([]);
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
    const storedSessionId = localStorage.getItem('admin_session_id');
    
    if (storedSessionId && storedSessionId !== sessionId) {
      localStorage.removeItem('admin_session_id');
      setAuthenticated(false);
      toast({
        title: 'Сессия завершена',
        description: 'Вход выполнен на другом устройстве',
        variant: 'destructive'
      });
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    const checkSession = () => {
      const storedSessionId = localStorage.getItem('admin_session_id');
      if (storedSessionId !== sessionId) {
        setAuthenticated(false);
        toast({
          title: 'Сессия завершена',
          description: 'Вход выполнен на другом устройстве',
          variant: 'destructive'
        });
      }
    };

    const interval = setInterval(checkSession, 2000);
    return () => clearInterval(interval);
  }, [authenticated, sessionId]);

  useEffect(() => {
    if (authenticated) {
      loadNews();
      loadDrafts();
      loadEvents();
      loadPlaces();
      loadMemory();
      loadAuthors();
      loadAbout();
    }
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(FUNCTIONS_URL.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: loginForm.login,
          password: loginForm.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('admin_session_id', sessionId);
        setAuthenticated(true);
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
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('admin_session_id');
    window.location.href = '/';
  };

  const loadNews = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.news}?status=published`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNewsList(data);
    } catch (error) {
      console.error('Failed to load news:', error);
      toast({ title: 'Ошибка', description: 'Не удалось загрузить новости', variant: 'destructive' });
    }
  };

  const loadDrafts = async () => {
    try {
      const response = await fetch(`${FUNCTIONS_URL.news}?status=draft`);
      if (!response.ok) throw new Error('Failed to fetch drafts');
      const data = await response.json();
      setDraftsList(data);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.events);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEventsList(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadPlaces = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces);
      if (!response.ok) throw new Error('Failed to fetch places');
      const data = await response.json();
      setPlacesList(data);
    } catch (error) {
      console.error('Failed to load places:', error);
    }
  };

  const loadMemory = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.memory);
      if (!response.ok) throw new Error('Failed to fetch memory');
      const data = await response.json();
      setMemoryList(data || []);
    } catch (error) {
      console.error('Failed to load memory articles:', error);
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
        if (!isDraft && newsForm.publish_telegram) {
          try {
            const newsUrl = `${window.location.origin}/news/${data.id}`;
            const socialResponse = await fetch(FUNCTIONS_URL.socialPublisher, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: newsForm.title,
                excerpt: newsForm.content,
                image_url: newsForm.image_url,
                news_url: newsUrl,
                publish_vk: false,
                publish_telegram: true
              })
            });
            
            const socialData = await socialResponse.json();
            
            if (socialData.published_count > 0) {
              toast({
                title: 'Успешно!',
                description: 'Новость опубликована и отправлена в Telegram'
              });
            } else {
              toast({
                title: 'Частично выполнено',
                description: 'Новость опубликована, но не удалось отправить в Telegram',
                variant: 'destructive'
              });
            }
          } catch (socialError) {
            console.error('Telegram publish error:', socialError);
            toast({
              title: 'Частично выполнено',
              description: 'Новость опубликована, но не удалось отправить в Telegram',
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: 'Успешно!',
            description: isDraft ? 'Черновик сохранён' : 'Новость опубликована'
          });
        }
        
        if (!isDraft) {
          try {
            await fetch('https://functions.poehali.dev/b67aed3b-df61-46cb-9e8e-05d4950ef6d1', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'queue',
                content_type: 'news',
                content_id: data.id,
                title: newsForm.title,
                body: newsForm.excerpt,
                url: `/news/${data.id}`
              })
            });
          } catch (notifError) {
            console.error('Failed to queue notification:', notifError);
          }
        }
        
        await loadNews();
        await loadDrafts();
        
        setNewsForm({
          title: '',
          category: 'Политика',
          excerpt: '',
          content: '',
          image_url: '',
          video_url: '',
          read_time: '5 мин',
          status: 'published',
          publish_telegram: true
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

  const handlePlaceSubmit = async () => {
    if (!placeForm.title || !placeForm.content || !placeForm.category) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeForm)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Успешно!',
          description: 'Место добавлено'
        });
        
        if (placeForm.is_published) {
          try {
            await fetch('https://functions.poehali.dev/b67aed3b-df61-46cb-9e8e-05d4950ef6d1', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'queue',
                content_type: 'place',
                content_id: data.id,
                title: placeForm.title,
                body: placeForm.excerpt || placeForm.content.substring(0, 100),
                url: `/places`
              })
            });
          } catch (notifError) {
            console.error('Failed to queue notification:', notifError);
          }
        }
        
        setPlaceForm({
          title: '',
          excerpt: '',
          content: '',
          category: 'Город завтракает',
          latitude: 45.0355,
          longitude: 38.9753,
          address: '',
          image_url: '',
          is_published: false,
          is_featured: false
        });
        await loadPlaces();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить место',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (id: number) => {
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.cityPlaces}?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Место удалено'
        });
        await loadPlaces();
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

  const handleTogglePublishPlace = async (id: number, isPublished: boolean) => {
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_published: isPublished })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: isPublished ? 'Место опубликовано' : 'Место скрыто'
        });
        await loadPlaces();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeaturedPlace = async (id: number, isFeatured: boolean) => {
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_featured: isFeatured })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: isFeatured ? 'Золотой маркер добавлен' : 'Золотой маркер убран'
        });
        await loadPlaces();
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

  const handleEditPlace = async (place: any) => {
    setPlaceForm({
      ...place,
      latitude: place.latitude || 45.0355,
      longitude: place.longitude || 38.9753
    });
  };

  const handleUpdatePlace = async () => {
    if (!placeForm.title || !placeForm.content || !placeForm.category) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeForm)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Место обновлено'
        });
        setPlaceForm({
          title: '',
          excerpt: '',
          content: '',
          category: 'Город завтракает',
          latitude: 45.0355,
          longitude: 38.9753,
          address: '',
          image_url: '',
          is_published: false,
          is_featured: false
        });
        await loadPlaces();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить место',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMemorySubmit = async () => {
    if (!memoryForm.title || !memoryForm.content || !memoryForm.year) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: название, год, история',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.memory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryForm)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Успешно!',
          description: 'Статья добавлена'
        });
        
        if (memoryForm.is_published) {
          try {
            await fetch('https://functions.poehali.dev/b67aed3b-df61-46cb-9e8e-05d4950ef6d1', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'queue',
                content_type: 'memory',
                content_id: data.id,
                title: memoryForm.title,
                body: memoryForm.excerpt || `${memoryForm.year} год: ${memoryForm.title}`,
                url: `/`
              })
            });
          } catch (notifError) {
            console.error('Failed to queue notification:', notifError);
          }
        }
        
        setMemoryForm({
          title: '',
          excerpt: '',
          content: '',
          year: '',
          decade: '',
          event_date: '',
          image_url: '',
          is_published: false
        });
        await loadMemory();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить статью',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (id: number) => {
    setLoading(true);

    try {
      const response = await fetch(`${FUNCTIONS_URL.memory}?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Статья удалена'
        });
        await loadMemory();
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

  const handleTogglePublishMemory = async (id: number, isPublished: boolean) => {
    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.memory, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_published: isPublished })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: isPublished ? 'Статья опубликована' : 'Статья скрыта'
        });
        await loadMemory();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMemory = async (memory: any) => {
    setMemoryForm({
      ...memory,
      year: memory.year || '',
      decade: memory.decade || '',
      event_date: memory.event_date || ''
    });
  };

  const handleUpdateMemory = async () => {
    if (!memoryForm.title || !memoryForm.content || !memoryForm.year) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FUNCTIONS_URL.memory, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memoryForm)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Статья обновлена'
        });
        setMemoryForm({
          title: '',
          excerpt: '',
          content: '',
          year: '',
          decade: '',
          event_date: '',
          image_url: '',
          is_published: false
        });
        await loadMemory();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статью',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToTelegram = async (news: any) => {
    setLoading(true);
    
    try {
      const newsUrl = `${window.location.origin}/news/${news.id}`;
      const response = await fetch(FUNCTIONS_URL.socialPublisher, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: news.title,
          excerpt: news.content,
          image_url: news.image_url,
          news_url: newsUrl,
          publish_vk: false,
          publish_telegram: true
        })
      });
      
      const data = await response.json();
      
      if (data.published_count > 0) {
        toast({
          title: 'Успешно!',
          description: 'Новость отправлена в Telegram'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.results?.telegram?.error || 'Не удалось отправить в Telegram',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Telegram publish error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить в Telegram',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVkDraft = async (news?: any) => {
    setLoading(true);
    
    const data = news || newsForm;
    const newsUrl = news ? `${window.location.origin}/news/${news.id}` : '';
    
    try {
      const response = await fetch(FUNCTIONS_URL.socialPublisher, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          excerpt: data.content,
          image_url: data.image_url,
          news_url: newsUrl,
          publish_vk: false,
          publish_telegram: false,
          save_vk_draft: true
        })
      });
      
      const result = await response.json();
      
      if (result.draft_saved) {
        toast({
          title: 'Успешно!',
          description: 'Черновик сохранён в VK (отложенная запись на 1 год)'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: result.results?.vk_draft?.error || 'Не удалось сохранить черновик в VK',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('VK draft save error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить черновик в VK',
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
    placeForm,
    setPlaceForm,
    newsList,
    draftsList,
    eventsList,
    placesList,
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
    handlePlaceSubmit,
    handleDeletePlace,
    handleTogglePublishPlace,
    handleToggleFeaturedPlace,
    handleEditPlace,
    handleUpdatePlace,
    memoryForm,
    setMemoryForm,
    memoryList,
    handleMemorySubmit,
    handleDeleteMemory,
    handleTogglePublishMemory,
    handleEditMemory,
    handleUpdateMemory,
    handleAuthorSubmit,
    handleDeleteAuthor,
    handleAboutSubmit,
    handlePublishToTelegram,
    handleSaveVkDraft
  };
};