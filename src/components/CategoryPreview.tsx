import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CategoryPreviewProps {
  cityPlaces: any[];
  categoryColors: Record<string, string>;
  onPlaceClick?: (placeId: number) => void;
}

export function CategoryPreview({
  cityPlaces,
  categoryColors,
  onPlaceClick,
}: CategoryPreviewProps) {
  const categories = ['Город завтракает', 'Город и кофе', 'Город поет', 'Город танцует'];
  
  const categoryPreviews = categories.map(category => {
    const places = cityPlaces.filter(p => p.category === category);
    const latestPlace = places[0];
    return { category, latestPlace, count: places.length };
  }).filter(item => item.latestPlace);

  if (categoryPreviews.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-serif font-black mb-8 tracking-tight">Рубрики городской жизни</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryPreviews.map(({ category, latestPlace, count }) => (
          <Card
            key={category}
            className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-0 shadow-sm group"
            onClick={() => onPlaceClick?.(latestPlace.id)}
          >
            <CardContent className="p-0">
              {latestPlace.image_url && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={latestPlace.image_url}
                    alt={latestPlace.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-serif font-bold text-base line-clamp-2 drop-shadow-lg">
                      {latestPlace.title}
                    </h3>
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
                    />
                    <span className="font-semibold text-sm">{category}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {count} {count === 1 ? 'место' : 'мест'}
                  </Badge>
                </div>
                {latestPlace.address && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Icon name="MapPin" size={12} />
                    <span className="line-clamp-1">{latestPlace.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}