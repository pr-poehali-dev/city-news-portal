import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const categories = Array.from(new Set(cityPlaces.map(p => p.category)));
  
  const filteredByCategory = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;
  
  const filteredPlaces = searchQuery
    ? filteredByCategory.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByCategory;

  const displayedPlaces = showAllPlaces ? filteredPlaces : filteredPlaces.slice(0, 4);

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Город говорит</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate('/places')}
            className="gap-2"
          >
            Все места
            <Icon name="ArrowRight" size={16} />
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск по названию, адресу или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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

      {searchQuery && (
        <div className="mb-4 text-sm text-muted-foreground">
          Найдено мест: {filteredPlaces.length}
        </div>
      )}

      <div 
        className="mb-8 relative cursor-pointer group overflow-hidden rounded-lg"
        onClick={() => navigate('/places/map')}
      >
        <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold">
            <Icon name="Map" size={20} />
            Открыть карту
          </div>
        </div>
        <div className="pointer-events-none">
          <CityMap places={filteredPlaces} onPlaceClick={() => {}} interactive={false} height="300px" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {displayedPlaces.map((place) => (
          <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all">
            <CardContent className="p-0">
              {place.image_url && (
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={place.image_url}
                    alt={place.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-3 right-3 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                  />
                </div>
              )}
              <div className="p-3 md:p-4">
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 line-clamp-1">{place.title}</h3>
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mb-2">
                  <Icon name="MapPin" size={12} className="flex-shrink-0" />
                  <span className="truncate">{place.address}</span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">{place.excerpt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Ничего не найдено</p>
          <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить запрос или выбрать другую категорию</p>
        </div>
      )}

      {filteredPlaces.length > 4 && !showAllPlaces && (
        <div className="text-center mt-6">
          <Button onClick={() => navigate('/places')} variant="outline">
            Показать все ({filteredPlaces.length})
          </Button>
        </div>
      )}
    </div>
  );
}