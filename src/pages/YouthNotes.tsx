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
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex gap-3 items-start">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md flex-shrink-0"
                      style={{ backgroundColor: `${note.color}20` }}
                    >
                      {note.emoji}
                    </div>
                    
                    <div className="flex-1">
                      <div 
                        className="bg-card border rounded-2xl rounded-tl-none p-4 shadow-sm hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: note.color, borderLeftWidth: '3px' }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-base">{note.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getTimeAgo(note.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: note.color }}>
                          <Icon name="Radio" size={12} />
                          <span className="font-medium">Редакция</span>
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
