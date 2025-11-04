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
  
  const filteredByCategory = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;

  const displayedPlaces = filteredByCategory.slice(0, 6);

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-20 py-20 lg:py-32">
        <div className="flex items-end justify-between mb-16 lg:mb-24">
          <div>
            <h2 className="text-5xl lg:text-8xl font-black tracking-tight mb-4">
              Город говорит
            </h2>
            <div className="w-24 h-1 bg-orange-600"></div>
          </div>
          
          <button
            onClick={() => navigate('/places')}
            className="hidden lg:flex items-center gap-3 px-8 py-4 bg-black text-white font-black hover:bg-gray-800 transition-colors"
          >
            <span className="tracking-wider">ВСЕ МЕСТА</span>
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {displayedPlaces.map((place) => (
            <article
              key={place.id}
              className="group cursor-pointer bg-white hover:bg-orange-600 transition-colors duration-300"
              onClick={() => {
                setSelectedPlace(place);
                setDialogOpen(true);
              }}
            >
              <div className="p-8 lg:p-12 h-full flex flex-col justify-between min-h-[350px]">
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-mono tracking-widest uppercase text-orange-600 group-hover:text-white transition-colors">
                      {place.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-black leading-tight mb-6 group-hover:text-white transition-colors">
                    {place.title}
                  </h3>
                </div>
                
                <div className="flex items-start gap-2 text-xs font-mono text-gray-400 group-hover:text-orange-200 transition-colors">
                  <Icon name="MapPin" size={12} className="flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{place.address}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="lg:hidden mt-8">
          <button
            onClick={() => navigate('/places')}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white font-black w-full"
          >
            <span className="tracking-wider">ВСЕ МЕСТА</span>
            <Icon name="ArrowRight" size={20} />
          </button>
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
