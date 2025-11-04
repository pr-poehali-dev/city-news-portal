import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import CityMap from '@/components/CityMap';
import { PlaceDialog } from '@/components/PlaceDialog';

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
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    <section className="py-32 px-6 lg:px-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={32} className="text-white" />
              </div>
              <h2 className="text-5xl lg:text-8xl font-black tracking-tight">
                Город говорит
              </h2>
            </div>
            <Button 
              onClick={() => navigate('/places')}
              className="px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors gap-3 flex-shrink-0"
            >
              Все места
              <Icon name="ArrowRight" size={20} />
            </Button>
          </div>
          <p className="text-gray-600 text-xl lg:text-2xl font-light">
            Лучшие заведения и места Краснодара
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPlaces.slice(0, 6).map((place) => (
            <MagneticCard
              key={place.id}
              onClick={() => {
                setSelectedPlace(place);
                setDialogOpen(true);
              }}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-3xl overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={place.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={place.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute top-4 right-4 w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] || '#FF6B6B' }}
                  ></div>
                </div>
                
                <div className="p-6">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: categoryColors[place.category as keyof typeof categoryColors] || '#FF6B6B' }}>
                    {place.category}
                  </span>
                  
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">
                    {place.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {place.excerpt}
                  </p>
                  
                  <div className="flex items-start gap-2 text-gray-400 text-xs">
                    <Icon name="MapPin" size={14} className="flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{place.address}</span>
                  </div>
                </div>
              </div>
            </MagneticCard>
          ))}
        </div>

        <PlaceDialog
          place={selectedPlace}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </section>

      <div className="grid grid-cols-2 gap-4">
        {displayedPlaces.map((place) => (
          <Card 
            key={place.id} 
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            onClick={() => {
              setSelectedPlace(place);
              setDialogOpen(true);
            }}
          >
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

      <PlaceDialog
        place={selectedPlace}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoryColor={selectedPlace ? categoryColors[selectedPlace.category as keyof typeof categoryColors] : undefined}
      />
    </div>
  );
}