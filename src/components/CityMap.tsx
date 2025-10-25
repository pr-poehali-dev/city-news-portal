import { useEffect, useRef } from 'react';

interface CityPlace {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  image_url?: string;
}

interface CityMapProps {
  places: CityPlace[];
  onPlaceClick: (id: number) => void;
}

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

declare global {
  interface Window {
    ymaps3: any;
  }
}

export default function CityMap({ places, onPlaceClick }: CityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const ymapInstance = useRef<any>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '1ecb8ea8-36e4-4c1d-a753-a203a45d737c';
    
    const loadYandexMaps = async () => {
      if (!mapRef.current) return;

      if (!window.ymaps3) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Yandex Maps'));
          document.head.appendChild(script);
        });
      }

      await window.ymaps3.ready;

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
      } = window.ymaps3;

      const center = places.length > 0
        ? [places[0].longitude, places[0].latitude]
        : [38.9753, 45.0355];

      if (!ymapInstance.current) {
        ymapInstance.current = new YMap(mapRef.current, {
          location: {
            center,
            zoom: 12,
          },
        });

        ymapInstance.current.addChild(new YMapDefaultSchemeLayer());
        ymapInstance.current.addChild(new YMapDefaultFeaturesLayer());
      }

      ymapInstance.current.update({ 
        location: { 
          center,
          zoom: 12 
        } 
      });

      const existingMarkers = ymapInstance.current.children.filter((child: any) => 
        child instanceof YMapMarker
      );
      existingMarkers.forEach((marker: any) => {
        ymapInstance.current.removeChild(marker);
      });

      places.forEach((place) => {
        const color = categoryColors[place.category as keyof typeof categoryColors] || '#FF6B6B';
        
        const markerElement = document.createElement('div');
        markerElement.style.cursor = 'pointer';
        markerElement.innerHTML = `
          <div style="position: relative; width: 40px; height: 40px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="1"/>
            </svg>
          </div>
        `;
        
        markerElement.onclick = () => onPlaceClick(place.id);
        
        markerElement.title = `${place.title}\n${place.excerpt}\n${place.address}`;

        const marker = new YMapMarker(
          {
            coordinates: [place.longitude, place.latitude],
          },
          markerElement
        );

        ymapInstance.current.addChild(marker);
      });
    };

    loadYandexMaps().catch(console.error);

    return () => {
      if (ymapInstance.current) {
        ymapInstance.current.destroy();
        ymapInstance.current = null;
      }
    };
  }, [places, onPlaceClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      className="z-0"
    />
  );
}