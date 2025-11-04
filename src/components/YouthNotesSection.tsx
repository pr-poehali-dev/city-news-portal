import { useState, useEffect, useRef } from 'react';
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
    <div className="mb-12">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-6 md:p-8 shadow-xl border border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📱</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Пульс города
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                В эфире сейчас
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {displayedNotes.map((note, index) => {
            const hasImage = !!note.image_url;
            const isLongText = note.content.length > 100;
            
            return (
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                      style={{ 
                        backgroundColor: note.color,
                      }}
                    >
                      {note.emoji}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 max-w-[85%]">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm shadow-sm">
                      {note.image_url && (
                        <img 
                          src={note.image_url} 
                          alt=""
                          className="w-full h-auto max-h-64 object-cover rounded-t-2xl"
                        />
                      )}
                      
                      <div className="p-3">
                        <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                          {note.content}
                        </p>
                        
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-[10px] text-gray-400">
                            {getTimeAgo(note.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {publishedNotes.length > 4 && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-[10px] px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 rounded-full text-gray-500">
              <div className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </div>
              Обновляется каждые 10 сек
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
