import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PlaceCard } from './PlaceCard';

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

interface PlacesListProps {
  places: Place[];
  filterFeatured: 'all' | 'featured' | 'regular';
  onFilterChange: (filter: 'all' | 'featured' | 'regular') => void;
  onEdit: (place: Place) => void;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, isPublished: boolean) => void;
  onToggleFeatured: (id: number, isFeatured: boolean) => void;
}

export function PlacesList({
  places,
  filterFeatured,
  onFilterChange,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: PlacesListProps) {
  const filteredPlaces = places.filter((place) => {
    if (filterFeatured === 'featured') return place.is_featured;
    if (filterFeatured === 'regular') return !place.is_featured;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Список мест ({filteredPlaces.length})</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filterFeatured === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFilterChange('all');
              }}
            >
              Все
            </Button>
            <Button
              variant={filterFeatured === 'featured' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFilterChange('featured');
              }}
            >
              <Icon name="Star" size={14} className="mr-1" />
              Избранные
            </Button>
            <Button
              variant={filterFeatured === 'regular' ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFilterChange('regular');
              }}
            >
              Обычные
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredPlaces.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Мест не найдено</p>
        ) : (
          filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePublish={onTogglePublish}
              onToggleFeatured={onToggleFeatured}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
