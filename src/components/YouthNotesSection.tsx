import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';
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

interface YouthNotesSectionProps {
  notes: YouthNote[];
}

export function YouthNotesSection({ notes }: YouthNotesSectionProps) {
  const navigate = useNavigate();
  const publishedNotes = notes.filter(n => n.is_published).slice(0, 6);
  
  if (publishedNotes.length === 0) return null;

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
    } catch {
      return '';
    }
  };

  return (
    <section className="py-32 px-6 lg:px-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl flex-shrink-0">📱</div>
              <h2 className="text-5xl lg:text-8xl font-black tracking-tight">
                Пульс города
              </h2>
            </div>
            <button
              onClick={() => navigate('/youth-notes')}
              className="hidden lg:flex px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors items-center gap-3 whitespace-nowrap flex-shrink-0"
            >
              Все заметки
              <Icon name="ArrowRight" size={20} />
            </button>
          </div>
          <p className="text-gray-500 text-xl lg:text-2xl font-light">
            Короткие заметки от редакции
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedNotes.map((note) => (
            <MagneticCard key={note.id}>
              <div className="bg-white rounded-3xl overflow-hidden h-full">
                {note.image_url && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={note.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                      style={{ backgroundColor: note.color }}
                    >
                      {note.emoji}
                    </div>
                    <span className="text-sm text-gray-400">
                      {getTimeAgo(note.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>
    </section>
  );
}