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

  const bentoLayout = [
    { cols: 'lg:col-span-6', rows: 'lg:row-span-2' },
    { cols: 'lg:col-span-3', rows: 'lg:row-span-1' },
    { cols: 'lg:col-span-3', rows: 'lg:row-span-1' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1' },
    { cols: 'lg:col-span-4', rows: 'lg:row-span-1' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto px-6 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-7xl lg:text-9xl font-black text-white mb-4">
              Город
            </h2>
            <h2 className="text-7xl lg:text-9xl font-black text-white/20">
              говорит
            </h2>
          </div>
          <button
            onClick={() => navigate('/places')}
            className="hidden lg:flex items-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:scale-105 transition-transform"
          >
            ВСЕ МЕСТА
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr">
          {displayedPlaces.map((place, index) => {
            const layout = bentoLayout[index % bentoLayout.length];
            const isHovered = hoveredId === place.id;
            const isLarge = layout.cols === 'lg:col-span-6';
            
            return (
              <article
                key={place.id}
                className={`group cursor-pointer ${layout.cols} ${layout.rows}`}
                onClick={() => {
                  setSelectedPlace(place);
                  setDialogOpen(true);
                }}
                onMouseEnter={() => setHoveredId(place.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative h-full overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-500 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}>
                  <div className={`relative h-full ${isLarge ? 'aspect-[16/10] lg:aspect-auto' : 'aspect-square lg:aspect-auto'}`}>
                    <img
                      src={place.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={place.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <div className="absolute top-6 left-6">
                      <span 
                        className="inline-block px-4 py-2 text-white text-xs font-bold rounded-full"
                        style={{ 
                          backgroundColor: categoryColors[place.category] || '#FF6B6B'
                        }}
                      >
                        {place.category}
                      </span>
                    </div>

                    <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 ${isLarge ? 'lg:p-12' : ''}`}>
                      <h3 className={`text-white font-black leading-tight mb-3 ${
                        isLarge ? 'text-3xl lg:text-5xl' : 'text-2xl lg:text-3xl'
                      }`}>
                        {place.title}
                      </h3>
                      
                      <div className="flex items-start gap-2 text-white/80 text-sm">
                        <Icon name="MapPin" size={16} className="flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{place.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/places')}
          className="lg:hidden mt-8 w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-orange-600 font-bold rounded-full"
        >
          ВСЕ МЕСТА
          <Icon name="ArrowRight" size={20} />
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
