import { useState, useEffect } from 'react';
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

interface YouthNotesSectionProps {
  notes: YouthNote[];
}

export function YouthNotesSection({ notes }: YouthNotesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedNotes, setDisplayedNotes] = useState<YouthNote[]>([]);
  const [animatingOut, setAnimatingOut] = useState<number | null>(null);
  
  const publishedNotes = notes.filter(n => n.is_published);
  
  useEffect(() => {
    if (publishedNotes.length === 0) return;
    
    setDisplayedNotes(publishedNotes.slice(0, 3));
    
    if (publishedNotes.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % publishedNotes.length;
        
        setAnimatingOut(0);
        
        setTimeout(() => {
          setDisplayedNotes(prevDisplayed => {
            const newNotes = [...prevDisplayed];
            newNotes.shift();
            newNotes.push(publishedNotes[nextIndex]);
            return newNotes;
          });
          setAnimatingOut(null);
        }, 500);
        
        return nextIndex;
      });
    }, 5000);
    
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
    <div className="mb-12 relative">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl -z-10"
        style={{ filter: 'blur(60px)' }}
      />
      
      <div className="bg-gradient-to-br from-background/80 to-muted/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-purple-200/20 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-md opacity-50 animate-pulse" />
            <div className="relative text-5xl bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-3 shadow-lg">
              📱
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Пульс города
            </h2>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Сейчас в эфире
            </p>
          </div>
        </div>

        <div className="space-y-5 max-w-3xl">
          {displayedNotes.map((note, index) => (
            <div
              key={`${note.id}-${index}`}
              className={`transform transition-all duration-500 ${
                animatingOut === index
                  ? 'translate-x-full opacity-0 scale-95'
                  : 'translate-x-0 opacity-100 scale-100'
              }`}
            >
              <div className="flex gap-4 items-start group">
                <div className="relative flex-shrink-0">
                  <div 
                    className="absolute inset-0 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ background: note.color }}
                  />
                  <div 
                    className="relative w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-xl border-2 border-white/50 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${note.color}40, ${note.color}20)`,
                      borderColor: note.color
                    }}
                  >
                    {note.emoji}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div 
                    className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-xl border-2 rounded-3xl rounded-tl-md p-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden"
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
                      <p className="text-base leading-relaxed mb-3">
                        {note.content}
                      </p>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div 
                          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ 
                            background: `${note.color}15`,
                            color: note.color
                          }}
                        >
                          <Icon name="Radio" size={11} />
                          Редакция
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="Clock" size={11} />
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

        <div 
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-3 text-xs px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="font-medium text-muted-foreground">
              {publishedNotes.length > 3 ? 'Новые сообщения каждые 5 сек' : 'Последние сообщения'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
