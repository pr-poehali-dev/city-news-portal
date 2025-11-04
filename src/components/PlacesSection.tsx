import { useState, useRef } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (cityPlaces.length === 0) return null;

  return (
    <>
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 border-l-4 border-red-600 pl-4">
              🏖️ Город говорит
            </h2>
            
            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-red-600 hover:text-white transition-all"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-red-600 hover:text-white transition-all"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
              <button
                onClick={() => navigate('/places')}
                className="ml-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                ВСЕ МЕСТА
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cityPlaces.slice(0, 12).map((place) => {
              const isHovered = hoveredId === place.id;
              
              return (
                <article
                  key={place.id}
                  className="flex-shrink-0 w-[280px] group cursor-pointer"
                  onClick={() => {
                    setSelectedPlace(place);
                    setDialogOpen(true);
                  }}
                  onMouseEnter={() => setHoveredId(place.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg h-[380px] hover:shadow-2xl transition-all duration-300">
                    <img
                      src={place.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={place.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span 
                        className="inline-block px-3 py-1 text-white text-xs font-bold rounded"
                        style={{ 
                          backgroundColor: categoryColors[place.category] || '#FF6B6B'
                        }}
                      >
                        {place.category}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2">
                        {place.title}
                      </h3>
                      
                      <div className="flex items-start gap-2 text-white/80 text-xs">
                        <Icon name="MapPin" size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{place.address}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/places')}
            className="lg:hidden mt-6 w-full px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            ВСЕ МЕСТА
            <Icon name="ArrowRight" size={20} />
          </button>
        </div>
      </section>

      <PlaceDialog
        place={selectedPlace}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
