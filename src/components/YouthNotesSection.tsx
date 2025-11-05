import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router-dom';

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
  const [displayedNotes, setDisplayedNotes] = useState<YouthNote[]>([]);
  const [animatingOut, setAnimatingOut] = useState<number | null>(null);
  const usedIndicesRef = useRef<Set<number>>(new Set());
  const currentRotationRef = useRef(0);
  
  const publishedNotes = notes.filter(n => n.is_published);
  
  useEffect(() => {
    if (publishedNotes.length === 0) return;
    
    const initialNotes = publishedNotes.slice(0, Math.min(4, publishedNotes.length));
    setDisplayedNotes(initialNotes);
    
    initialNotes.forEach((_, idx) => usedIndicesRef.current.add(idx));
    currentRotationRef.current = initialNotes.length;
    
    if (publishedNotes.length <= 4) return;
    
    const interval = setInterval(() => {
      if (usedIndicesRef.current.size >= publishedNotes.length) {
        usedIndicesRef.current.clear();
        currentRotationRef.current = 0;
      }
      
      let nextIndex = currentRotationRef.current % publishedNotes.length;
      while (usedIndicesRef.current.has(nextIndex)) {
        nextIndex = (nextIndex + 1) % publishedNotes.length;
      }
      
      usedIndicesRef.current.add(nextIndex);
      currentRotationRef.current = nextIndex + 1;
      
      setAnimatingOut(0);
      
      setTimeout(() => {
        setDisplayedNotes(prevDisplayed => {
          const newNotes = [...prevDisplayed];
          const removedNote = newNotes.shift();
          if (removedNote) {
            const removedIdx = publishedNotes.findIndex(n => n.id === removedNote.id);
            if (removedIdx !== -1) {
              usedIndicesRef.current.delete(removedIdx);
            }
          }
          newNotes.push(publishedNotes[nextIndex]);
          return newNotes;
        });
        setAnimatingOut(null);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [publishedNotes.length]);
  
  if (publishedNotes.length === 0) return null;

  const getTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru });
    } catch {
      return '';
    }
  };

  return (
    <section className="mb-12 md:mb-16 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-primary px-6 md:px-12 py-12 md:py-16 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-4 md:mb-6">
              ПУЛЬС
            </h2>
            <div className="h-2 md:h-3 w-24 md:w-40 bg-accent"></div>
          </div>
          <Link to="/youth-notes" className="hidden md:block">
            <Icon name="ArrowUpRight" size={48} className="text-white/20 flex-shrink-0 md:w-20 md:h-20 hover:text-white/40 transition-colors" />
          </Link>
        </div>
      </div>

      <div className="bg-white border-b-4 border-primary p-6 md:p-12">
        <div className="space-y-3">
          {displayedNotes.map((note, index) => (
            <div
              key={`${note.id}-${index}`}
              className={`transform transition-all duration-500 ${
                animatingOut === index
                  ? 'translate-x-full opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              <div className="flex gap-2.5 items-end">
                <div className="flex-shrink-0 mb-1">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg border-2 border-primary"
                    style={{ backgroundColor: note.color }}
                  >
                    {note.emoji}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 max-w-[85%]">
                  <div className="bg-[#F5F5F5] border-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {note.image_url && (
                      <img 
                        src={note.image_url} 
                        alt=""
                        className="w-full h-auto max-h-64 object-cover border-b-2 border-primary"
                      />
                    )}
                    
                    <div className="p-3">
                      <p className="text-sm text-black leading-relaxed whitespace-pre-wrap break-words font-bold">
                        {note.content}
                      </p>
                      
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-gray-600 uppercase font-bold">
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

        {publishedNotes.length > 4 && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-[10px] px-3 py-1.5 bg-[#2ECC40] text-white font-black uppercase rounded-none border-2 border-primary">
              Обновляется каждые 10 сек
            </div>
          </div>
        )}
      </div>


    </section>
  );
}