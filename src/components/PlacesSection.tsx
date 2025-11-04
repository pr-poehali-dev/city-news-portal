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
    <section className="bg-gradient-to-br from-orange-900 via-amber-900 to-orange-900">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-2">
              Город говорит
            </h2>
            <div className="w-20 h-1 bg-white"></div>
          </div>
          
          <button
            onClick={() => navigate('/places')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-orange-900 font-black hover:bg-gray-200 transition-colors"
          >
            <span className="tracking-wider">ВСЕ МЕСТА</span>
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedPlaces.map((place) => {
            const isHovered = hoveredId === place.id;
            
            return (
              <article
                key={place.id}
                className="group relative cursor-pointer overflow-hidden aspect-[4/5]"
                onClick={() => {
                  setSelectedPlace(place);
                  setDialogOpen(true);
                }}
                onMouseEnter={() => setHoveredId(place.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <img
                  src={place.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                  alt={place.title}
                  className={`w-full h-full object-cover transition-all duration-[1500ms] ${
                    isHovered ? 'scale-110 brightness-90' : 'scale-100'
                  }`}
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-80'
                }`}></div>

                <div className="absolute top-6 left-6 z-10">
                  <span 
                    className={`inline-block px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isHovered ? 'backdrop-blur-none' : ''
                    }`}
                    style={{ 
                      backgroundColor: isHovered ? (categoryColors[place.category] || '#FF6B6B') : undefined 
                    }}
                  >
                    {place.category}
                  </span>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 transition-all duration-500 ${
                  isHovered ? 'translate-y-0' : 'translate-y-2'
                }`}>
                  <h3 className="text-xl lg:text-2xl text-white font-black leading-tight mb-4">
                    {place.title}
                  </h3>
                  
                  <div className={`flex items-start gap-2 text-gray-400 text-sm transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-70'
                  }`}>
                    <Icon name="MapPin" size={14} className="flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{place.address}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <PlaceDialog
          place={selectedPlace}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </section>
  );
}
