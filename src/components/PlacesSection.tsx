import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CityMap from '@/components/CityMap';

interface PlacesSectionProps {
  cityPlaces: any[];
  selectedCategory: string | null;
  showAllPlaces: boolean;
  categoryColors: Record<string, string>;
  onCategorySelect: (category: string | null) => void;
  onShowAllToggle: () => void;
}

export function PlacesSection({
  cityPlaces,
  selectedCategory,
  showAllPlaces,
  categoryColors,
  onCategorySelect,
  onShowAllToggle,
}: PlacesSectionProps) {
  const categories = Array.from(new Set(cityPlaces.map(p => p.category)));
  const filteredPlaces = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;

  const displayedPlaces = showAllPlaces ? filteredPlaces : filteredPlaces.slice(0, 6);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Город говорит</h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategorySelect(null)}
          >
            Все
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategorySelect(cat)}
              className="gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors[cat as keyof typeof categoryColors] }}
              />
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <CityMap places={filteredPlaces} onPlaceClick={(id) => console.log('Place clicked:', id)} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPlaces.map((place) => (
          <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all">
            <CardContent className="p-0">
              {place.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image_url}
                    alt={place.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{place.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Icon name="MapPin" size={14} />
                  <span>{place.address}</span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-3">{place.excerpt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlaces.length > 6 && (
        <div className="text-center mt-6">
          <Button onClick={onShowAllToggle} variant="outline">
            {showAllPlaces ? 'Показать меньше' : `Показать все (${filteredPlaces.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}