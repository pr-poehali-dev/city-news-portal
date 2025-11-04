import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
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
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  const filteredByCategory = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;

  const displayedPlaces = filteredByCategory.slice(0, 6);

  return (
    <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-100 to-transparent -z-10"></div>
      
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-red-600 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
              ЛУЧШИЕ МЕСТА
            </span>
            <h2 className="text-5xl lg:text-7xl font-black">
              Город говорит
            </h2>
          </div>
          <button
            onClick={() => navigate('/places')}
            className="hidden lg:flex items-center gap-2 text-sm font-bold tracking-wider hover:text-red-600 transition-colors"
          >
            ВСЕ МЕСТА
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayedPlaces.map((place, index) => {
            const isHovered = hoveredId === place.id;
            const isLarge = index === 0 || index === 3;
            
            return (
              <article
                key={place.id}
                className={`group relative cursor-pointer overflow-hidden ${
                  isLarge ? 'col-span-2 row-span-2' : 'col-span-1'
                }`}
                onClick={() => {
                  setSelectedPlace(place);
                  setDialogOpen(true);
                }}
                onMouseEnter={() => setHoveredId(place.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden ${
                  isLarge ? 'aspect-[16/10]' : 'aspect-square'
                }`}>
                  <img
                    src={place.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={place.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isHovered ? 'scale-110 brightness-75' : 'scale-100 brightness-100'
                    }`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                  <div className="absolute top-4 left-4 z-10">
                    <span 
                      className="inline-block px-3 py-1 text-white text-[10px] font-bold tracking-[0.3em] uppercase"
                      style={{ 
                        backgroundColor: categoryColors[place.category] || '#FF6B6B'
                      }}
                    >
                      {place.category}
                    </span>
                  </div>

                  <div className={`absolute bottom-0 left-0 right-0 p-4 lg:p-6 transition-all duration-500 ${
                    isLarge ? 'lg:p-8' : ''
                  } ${
                    isHovered ? 'translate-y-0' : 'translate-y-2'
                  }`}>
                    <h3 className={`text-white font-black leading-tight mb-2 transition-all duration-300 ${
                      isLarge ? 'text-2xl lg:text-4xl mb-4' : 'text-lg lg:text-xl'
                    }`}>
                      {place.title}
                    </h3>
                    
                    <div className={`flex items-start gap-2 text-gray-300 text-xs lg:text-sm transition-opacity duration-500 ${
                      isHovered ? 'opacity-100' : 'opacity-70'
                    }`}>
                      <Icon name="MapPin" size={14} className="flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{place.address}</span>
                    </div>

                    {isLarge && isHovered && (
                      <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold">
                        <span>ПОДРОБНЕЕ</span>
                        <Icon name="ArrowRight" size={14} />
                      </div>
                    )}
                  </div>

                  <div className={`absolute inset-0 border-2 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`} style={{ borderColor: categoryColors[place.category] || '#FF6B6B' }}></div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/places')}
          className="lg:hidden mt-8 w-full flex items-center justify-center gap-2 text-sm font-bold tracking-wider hover:text-red-600 transition-colors"
        >
          ВСЕ МЕСТА
          <Icon name="ArrowRight" size={16} />
        </button>

        <PlaceDialog
          place={selectedPlace}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </section>
  );
}
