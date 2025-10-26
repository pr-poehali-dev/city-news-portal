import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const publishedNotes = notes.filter(n => n.is_published);
  
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
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📱</div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Пульс города
          </h2>
          <p className="text-muted-foreground">Короткие заметки от редакции для молодёжи</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publishedNotes.map((note) => (
          <Card
            key={note.id}
            className={`group hover:shadow-xl transition-all duration-300 border-2 cursor-pointer transform hover:-translate-y-1`}
            style={{ 
              borderColor: note.color,
              background: `linear-gradient(135deg, ${note.color}08 0%, transparent 100%)`
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{note.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    {note.title}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${note.color}20`,
                      color: note.color,
                      borderColor: note.color
                    }}
                  >
                    <Icon name="Clock" size={12} className="mr-1" />
                    {getTimeAgo(note.created_at)}
                  </Badge>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {note.content}
              </p>

              <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Sparkles" size={14} />
                  От редакции
                </span>
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  className="group-hover:translate-x-1 transition-transform"
                  style={{ color: note.color }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {publishedNotes.length > 6 && (
        <div className="text-center mt-6">
          <Badge 
            variant="outline" 
            className="text-sm px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300"
          >
            <Icon name="Zap" size={14} className="mr-2" />
            Показано последние {Math.min(publishedNotes.length, 6)} заметок
          </Badge>
        </div>
      )}
    </div>
  );
}
