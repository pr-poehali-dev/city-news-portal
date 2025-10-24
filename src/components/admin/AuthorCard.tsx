import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface AuthorCardProps {
  author: any;
  loading: boolean;
  onDelete: () => void;
}

export const AuthorCard = ({ author, loading, onDelete }: AuthorCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        {author.photo_url ? (
          <img src={author.photo_url} alt={author.name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="User" size={24} className="text-primary" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{author.name}</h3>
          {author.position && (
            <p className="text-sm text-muted-foreground">{author.position}</p>
          )}
          {author.bio && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{author.bio}</p>
          )}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            size="sm" 
            variant="destructive"
            disabled={loading}
            className="w-full"
          >
            <Icon name="Trash2" size={14} className="mr-1" />
            Удалить
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить автора?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Автор будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
