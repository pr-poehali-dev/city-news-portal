import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { PlaceDialog } from '@/components/PlaceDialog';

interface PlacesHorizontalProps {
  places: any[];
}

const categoryColors: Record<string, string> = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

export const PlacesHorizontal = ({ places }: PlacesHorizontalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (places.length === 0) return null;

  return (
    <>
      <section className="relative bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-[95vw] mx-auto">
          <div className="flex items-center justify-between mb-12 px-6 lg:px-12">
            <div>
              <h2 className="text-5xl lg:text-8xl font-black text-white">
                Город говорит
              </h2>
              <p className="text-white/70 text-xl lg:text-2xl mt-2 font-bold">
                Лучшие места
              </p>
            </div>
            
            <div className="hidden lg:flex gap-3">
              <button
                onClick={() => scroll('left')}
                className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-orange-600 transition-all"
              >
                <Icon name="ChevronLeft" size={28} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-orange-600 transition-all"
              >
                <Icon name="ChevronRight" size={28} />
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-6 lg:px-12"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {places.slice(0, 12).map((place) => (
              <article
                key={place.id}
                className="flex-shrink-0 w-[75vw] lg:w-[400px] group cursor-pointer"
                onClick={() => {
                  setSelectedPlace(place);
                  setDialogOpen(true);
                }}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl h-[500px] group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={place.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

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

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-black text-sm md:text-base leading-tight tracking-tighter mb-3 line-clamp-2">
                      {place.title}
                    </h3>
                    
                    <div className="flex items-start gap-2 text-white/80 text-sm">
                      <Icon name="MapPin" size={16} className="flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{place.address}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PlaceDialog
        place={selectedPlace}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};