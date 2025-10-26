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
            <div className="space-y-5">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="animate-in fade-in slide-in-from-left-4 duration-500 group"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <div className="flex gap-4 items-start">
                    <div className="relative">
                      <div 
                        className="absolute inset-0 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"
                        style={{ background: note.color }}
                      />
                      <div 
                        className="relative w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-xl border-2 border-white/50 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          background: `linear-gradient(135deg, ${note.color}40, ${note.color}20)`,
                          borderColor: note.color
                        }}
                      >
                        {note.emoji}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div 
                        className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border-2 rounded-3xl rounded-tl-md p-5 shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        style={{ 
                          borderColor: `${note.color}40`,
                          background: `linear-gradient(135deg, ${note.color}08, transparent)`
                        }}
                      >
                        <div 
                          className="absolute top-0 left-0 w-1 h-full"
                          style={{ 
                            background: `linear-gradient(to bottom, ${note.color}, transparent)` 
                          }}
                        />
                        
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span 
                              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                              style={{ 
                                background: `${note.color}20`,
                                color: note.color
                              }}
                            >
                              {note.title}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              {getTimeAgo(note.created_at)}
                            </span>
                          </div>
                          
                          <p className="text-base leading-relaxed">
                            {note.content}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-muted-foreground/20">
                            <div 
                              className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
                              style={{ 
                                background: `${note.color}15`,
                                color: note.color
                              }}
                            >
                              <Icon name="Radio" size={12} />
                              Редакция
                            </div>
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