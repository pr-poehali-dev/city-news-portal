import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface YouthNotesSectionProps {
  notes: YouthNote[];
}

export function YouthNotesSection({ notes }: YouthNotesSectionProps) {
  const navigate = useNavigate();
  const [visibleNotes, setVisibleNotes] = useState<number[]>([]);
  
  const publishedNotes = notes.filter(n => n.is_published).slice(0, 3);
  
  useEffect(() => {
    setVisibleNotes([]);
    publishedNotes.forEach((_, index) => {
      setTimeout(() => {
        setVisibleNotes(prev => [...prev, index]);
      }, index * 300);
    });
  }, [notes]);
  
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📱</div>
          <div>
            <h2 className="text-3xl font-bold">Пульс города</h2>
            <p className="text-muted-foreground">Короткие заметки от редакции</p>
          </div>
        </div>
        {notes.filter(n => n.is_published).length > 3 && (
          <Button variant="outline" className="gap-2" onClick={() => navigate('/youth-notes')}>
            Все заметки
            <Icon name="ArrowRight" size={16} />
          </Button>
        )}
      </div>

      <div className="space-y-4 max-w-3xl">
        {publishedNotes.map((note, index) => (
          <div
            key={note.id}
            className={`transform transition-all duration-500 ${
              visibleNotes.includes(index)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
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

      {visibleNotes.length === publishedNotes.length && publishedNotes.length > 0 && (
        <div 
          className="text-center mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: '900ms', animationFillMode: 'backwards' }}
        >
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground px-4 py-2 bg-muted/50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Онлайн
          </div>
        </div>
      )}
    </div>
  );
}