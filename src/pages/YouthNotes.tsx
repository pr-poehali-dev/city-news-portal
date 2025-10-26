import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface YouthNote {
  id: number;
  title: string;
  content: string;
  emoji: string;
  color: string;
  created_at: string;
  is_published: boolean;
  image_url?: string;
}

const FUNCTIONS_URL = 'https://functions.poehali.dev/97a5ec9d-d662-4652-be23-350205ec6759';

export default function YouthNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<YouthNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.filter((n: YouthNote) => n.is_published));
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        sections={['Главная', 'СВО', 'Политика', 'Экономика', 'Культура', 'Спорт', 'События', 'О портале', 'Контакты']}
        activeSection=""
        onSectionChange={(section) => {
          if (section === 'Главная') navigate('/');
          else if (section === 'О портале') navigate('/about');
          else if (section === 'Контакты') navigate('/contacts');
          else navigate('/');
        }}
        onSearch={() => {}}
      />

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2" 
            onClick={() => navigate('/')}
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-5xl">📱</div>
              <h1 className="text-4xl font-bold">Пульс города</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Все короткие заметки от редакции для молодёжи
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Пока нет заметок</p>
            </div>
          ) : (
            <div className="space-y-5">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="animate-in fade-in slide-in-from-left-4 duration-500 group"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex gap-3 items-start">
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md"
                        style={{ 
                          background: `linear-gradient(135deg, ${note.color}40, ${note.color}20)`,
                        }}
                      >
                        {note.emoji}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div 
                        className="relative bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-3 shadow-md hover:shadow-lg transition-all duration-300"
                        style={{ 
                          borderLeft: `3px solid ${note.color}`
                        }}
                      >
                        <div className="relative">
                          {note.image_url && (
                            <div className="mb-2 -mx-3 -mt-3">
                              <img 
                                src={note.image_url} 
                                alt=""
                                className="w-full h-48 object-cover rounded-t-xl"
                              />
                            </div>
                          )}
                          
                          <p className="text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                            {note.content}
                          </p>
                          
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="Radio" size={10} />
                              <span>Редакция</span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={10} />
                              {getTimeAgo(note.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && notes.length > 0 && (
            <div className="text-center mt-8 text-muted-foreground text-sm">
              Всего заметок: {notes.length}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}