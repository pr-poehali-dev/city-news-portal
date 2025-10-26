import { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

interface PlaceForm {
  latitude: number;
  longitude: number;
  category: string;
  is_featured: boolean;
}

interface PlaceMapProps {
  placeForm: PlaceForm;
  onMapClick: (lat: number, lng: number) => void;
}

export function PlaceMap({ placeForm, onMapClick }: PlaceMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const center: [number, number] = placeForm.latitude && placeForm.longitude
      ? [placeForm.latitude, placeForm.longitude]
      : [45.0355, 38.9753];

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(center, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapRef.current);

      mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });
    }

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    if (placeForm.latitude && placeForm.longitude) {
      const markerColor = placeForm.is_featured ? '#FFD700' : categoryColors[placeForm.category as keyof typeof categoryColors] || '#FF6B6B';
      const markerSize = placeForm.is_featured ? 50 : 40;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative; width: ${markerSize}px; height: ${markerSize}px;">
            <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 24 24" fill="${markerColor}" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="1"/>
            </svg>
            ${placeForm.is_featured ? '<div style="position: absolute; top: 8px; left: 50%; transform: translateX(-50%); font-size: 16px;">⭐</div>' : ''}
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize],
      });

      markerRef.current = L.marker([placeForm.latitude, placeForm.longitude], { icon }).addTo(mapRef.current);
      mapRef.current.setView([placeForm.latitude, placeForm.longitude], 12);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [placeForm.latitude, placeForm.longitude, placeForm.is_featured, placeForm.category, onMapClick]);

  return (
    <div className="space-y-2">
      <Label>Местоположение на карте (кликните для выбора)</Label>
      <div ref={containerRef} className="w-full h-[400px] rounded-lg border" />
      <p className="text-sm text-muted-foreground">
        💡 Кликните на карту, чтобы выбрать точное местоположение
      </p>
    </div>
  );
}
