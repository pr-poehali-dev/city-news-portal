import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
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
  
  const filteredPlaces = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;

  const displayedPlaces = filteredPlaces.slice(0, 3);

  if (cityPlaces.length === 0) return null;

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-[#0074D9] px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              МЕСТА
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-white"></div>
          </div>
          <div 
            onClick={() => navigate('/places')}
            className="cursor-pointer hidden md:block"
          >
            <Icon name="ArrowUpRight" size={48} className="text-white/30 flex-shrink-0 md:w-16 md:h-16 hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {displayedPlaces.map((place, index) => (
          <Card
            key={place.id}
            className={`group relative cursor-pointer overflow-hidden bg-white border-b-4 ${
              index < 2 ? 'md:border-r-4' : ''
            } border-primary transition-all hover:z-10 rounded-none`}
            onClick={() => {
              setSelectedPlace(place);
              setDialogOpen(true);
            }}
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-black">
              {place.image_url ? (
                <img
                  src={place.image_url}
                  alt={place.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-[#0074D9]/20 flex items-center justify-center">
                  <Icon name="MapPin" size={64} className="text-[#0074D9]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
              
              <div className="absolute top-3 left-3 md:top-6 md:left-6">
                <div 
                  className="px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: categoryColors[place.category] || '#0074D9' }}
                >
                  <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                    {place.category}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                <h3 className="text-white text-xl md:text-2xl font-black uppercase leading-tight tracking-tighter mb-2 group-hover:text-[#0074D9] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)] line-clamp-2">
                  {place.title}
                </h3>
                
                <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider font-bold">
                  <Icon name="MapPin" size={14} />
                  <span className="truncate">{place.address}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-white border-b-4 border-primary p-4">
        <div 
          onClick={() => navigate('/places')}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 text-black font-black uppercase text-sm hover:text-[#0074D9] transition-colors">
            Все места на карте
            <Icon name="ArrowRight" size={16} />
          </div>
        </div>
      </div>

      <PlaceDialog
        place={selectedPlace}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoryColor={selectedPlace ? categoryColors[selectedPlace.category] : undefined}
      />
    </section>
  );
}