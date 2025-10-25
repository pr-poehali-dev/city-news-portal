import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const createCustomIcon = (category: string, isFeatured: boolean = false) => {
  const color = isFeatured ? '#FFD700' : (categoryColors[category as keyof typeof categoryColors] || '#FF6B6B');
  const size = isFeatured ? 50 : 40;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="1.5"/>
        </svg>
        ${isFeatured ? '<div style="position: absolute; top: -8px; right: -8px; font-size: 20px;">⭐</div>' : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

export default function CityMap({ places, onPlaceClick }: CityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (places.length === 0) return;

    const center: [number, number] = places.length > 0 
      ? [places[0].latitude, places[0].longitude]
      : [45.0355, 38.9753];

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(center, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    places.forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude], {
        icon: createCustomIcon(place.category, place.is_featured),
      });

      marker.on('click', () => {
        onPlaceClick(place.id);
      });

      marker.bindPopup(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${place.title}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${place.excerpt}</p>
          <p style="font-size: 12px; color: #999;">${place.address}</p>
        </div>
      `);

      if (mapRef.current) {
        marker.addTo(mapRef.current);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places, onPlaceClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (places.length === 0) {
      const center: [number, number] = [45.0355, 38.9753];

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current).setView(center, 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(mapRef.current);
      }
    }

    return () => {
      if (mapRef.current && places.length === 0) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places]);

  return (
    <div 
      ref={containerRef} 
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      className="z-0"
    />
  );
}