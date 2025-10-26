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
  image_url?: string;
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

        <div className="space-y-4 max-w-3xl">
          {displayedNotes.map((note, index) => (
            <div
              key={`${note.id}-${index}`}
              className={`transform transition-all duration-500 ${
                animatingOut === index
                  ? 'translate-x-full opacity-0 scale-95'
                  : 'translate-x-0 opacity-100 scale-100'
              }`}
            >
              <div className="flex gap-3 items-start group">
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
                    className="relative bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm p-3 shadow-md group-hover:shadow-lg transition-all duration-300"
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

        <div 
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-3 text-xs px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="font-medium text-muted-foreground">
              {publishedNotes.length > 3 ? 'Новые сообщения каждые 10 сек' : 'Последние сообщения'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
