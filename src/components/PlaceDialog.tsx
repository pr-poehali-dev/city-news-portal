import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface PlaceDialogProps {
  place: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryColor?: string;
}

export const PlaceDialog = ({ place, open, onOpenChange, categoryColor }: PlaceDialogProps) => {
  if (!place) return null;

  const renderContentWithImages = (content: string) => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = imageRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      
      const alt = match[1] || 'Изображение';
      const imageUrl = match[2];
      
      parts.push(
        <img 
          key={key++}
          src={imageUrl} 
          alt={alt}
          className="w-full rounded-lg my-4 object-contain"
          style={{ maxHeight: '400px' }}
        />
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts;
  };

  const openInMaps = () => {
    const url = `https://yandex.ru/maps/?pt=${place.longitude},${place.latitude}&z=16&l=map`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{place.title}</DialogTitle>
        </DialogHeader>

        {place.image_url && (
          <div className="relative -mx-6 -mt-4 mb-4">
            <img
              src={place.image_url}
              alt={place.title}
              className="w-full h-64 object-cover"
            />
            {categoryColor && (
              <div
                className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: categoryColor }}
              />
            )}
            {place.is_featured && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <span>⭐</span>
                <span>Город оценил</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Icon name="MapPin" size={20} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Адрес</p>
              <p className="text-muted-foreground">{place.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="Tag" size={20} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Категория</p>
              <p className="text-muted-foreground">{place.category}</p>
            </div>
          </div>

          {place.excerpt && (
            <>
              <Separator />
              <div>
                <p className="font-semibold text-lg mb-2">{place.excerpt}</p>
              </div>
            </>
          )}

          {place.content && (
            <>
              <Separator />
              <div className="prose max-w-none">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {renderContentWithImages(place.content)}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-2">
            <Button onClick={openInMaps} className="flex-1 gap-2">
              <Icon name="Map" size={18} />
              Открыть на карте
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
