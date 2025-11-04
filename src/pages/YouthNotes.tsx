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
    <div className="min-h-screen bg-white">
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

      <main className="px-4 lg:px-20 py-20 mt-20">
        <div className="max-w-6xl mx-auto">
          <button
            className="mb-12 text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Icon name="ArrowLeft" size={20} />
            <span>На главную</span>
          </button>

          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
                📱
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Пульс города</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Короткие заметки от редакции для молодёжи
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">Пока нет заметок</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="break-inside-avoid mb-6"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    {note.image_url && (
                      <img 
                        src={note.image_url} 
                        alt=""
                        className="w-full h-auto object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: note.color }}
                        >
                          {note.emoji}
                        </div>
                        <span className="text-xs text-gray-400">
                          {getTimeAgo(note.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                        {note.content}
                      </p>
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