import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useRef } from 'react';

interface YouthNote {
  id: number;
  title: string;
  description?: string;
  content?: string;
  emoji?: string;
  color?: string;
  created_at: string;
  is_published: boolean;
  image_url?: string;
}

interface YouthNotesSectionProps {
  youthNotes: YouthNote[];
}

export function YouthNotesSection({ youthNotes }: YouthNotesSectionProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (youthNotes.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-12 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 border-l-4 border-green-600 pl-4">
            💬 Молодёжные заметки
          </h2>
          
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-md"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-md"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
            <button
              onClick={() => navigate('/youth-notes')}
              className="ml-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              ВСЕ ЗАМЕТКИ
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {youthNotes.slice(0, 12).map((note) => (
            <article
              key={note.id}
              className="flex-shrink-0 w-[280px] group cursor-pointer"
              onClick={() => navigate('/youth-notes')}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {note.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={note.image_url}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {note.emoji && (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ backgroundColor: note.color || '#10b981' }}
                      >
                        {note.emoji}
                      </div>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                  </div>
                  
                  <h3 className="text-gray-900 font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {note.title}
                  </h3>
                  
                  {note.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {note.description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={() => navigate('/youth-notes')}
          className="lg:hidden mt-6 w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          ВСЕ ЗАМЕТКИ
          <Icon name="ArrowRight" size={20} />
        </button>
      </div>
    </section>
  );
}
