import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

interface Place {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  address: string;
  image_url: string;
  is_published: boolean;
  is_featured: boolean;
}

interface PlaceCardProps {
  place: Place;
  onEdit: (place: Place) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, isPublished: boolean) => void;
  onToggleFeatured: (id: number, isFeatured: boolean) => void;
}

export function PlaceCard({ place, onEdit, onDelete, onTogglePublish, onToggleFeatured }: PlaceCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {place.image_url && (
            <img 
              src={place.image_url} 
              alt={place.title}
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{place.title}</h3>
                  {place.is_featured && (
                    <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <Badge 
                  style={{ 
                    backgroundColor: categoryColors[place.category as keyof typeof categoryColors],
                    color: 'white'
                  }}
                >
                  {place.category}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(place);
                  }}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Удалить это место?')) {
                      onDelete(place.id);
                    }
                  }}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{place.excerpt}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="MapPin" size={12} />
              {place.address}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant={place.is_published ? 'default' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePublish(place.id, !place.is_published);
                }}
              >
                <Icon name={place.is_published ? 'Eye' : 'EyeOff'} size={14} className="mr-1" />
                {place.is_published ? 'Опубликовано' : 'Черновик'}
              </Button>
              <Button
                variant={place.is_featured ? 'default' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFeatured(place.id, !place.is_featured);
                }}
              >
                <Icon name="Star" size={14} className="mr-1" />
                {place.is_featured ? 'В избранном' : 'Добавить в избранное'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
