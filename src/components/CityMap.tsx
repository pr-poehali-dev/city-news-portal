import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const createCustomIcon = (category: string) => {
  const color = categoryColors[category as keyof typeof categoryColors] || '#FF6B6B';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

export default function CityMap({ places, onPlaceClick }: CityMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const center: [number, number] = places.length > 0 
    ? [places[0].latitude, places[0].longitude]
    : [55.7558, 37.6173];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={createCustomIcon(place.category)}
          eventHandlers={{
            click: () => onPlaceClick(place.id),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-sm mb-1">{place.title}</h3>
              <p className="text-xs text-gray-600 mb-1">{place.excerpt}</p>
              <p className="text-xs text-gray-500">{place.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
