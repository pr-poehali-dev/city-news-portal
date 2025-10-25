import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { MapContainer, TileLayer, Marker, useMapEvents, MapContainerProps } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PLACE_CATEGORIES = [
  'Город завтракает',
  'Город и кофе',
  'Город поет',
  'Город танцует',
];

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

interface PlaceForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  image_url: string;
  is_published: boolean;
}

interface PlacesManagementProps {
  placeForm: PlaceForm;
  setPlaceForm: (form: PlaceForm) => void;
  placesList: any[];
  loading: boolean;
  onPlaceSubmit: () => void;
  onDeletePlace: (id: number) => void;
  onTogglePublish: (id: number, isPublished: boolean) => void;
}

function LocationMarker({ position, onPositionChange }: any) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  const icon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 40px; height: 40px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#FF6B6B" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="1"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

export function PlacesManagement({
  placeForm,
  setPlaceForm,
  placesList,
  loading,
  onPlaceSubmit,
  onDeletePlace,
  onTogglePublish,
}: PlacesManagementProps) {
  const [mapPosition, setMapPosition] = useState<[number, number]>([45.0355, 38.9753]);
  const [mapKey, setMapKey] = useState(0);

  const handleMapClick = (position: [number, number]) => {
    setMapPosition(position);
    setPlaceForm({
      ...placeForm,
      latitude: position[0],
      longitude: position[1],
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить место</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="place-title">Название места</Label>
              <Input
                id="place-title"
                value={placeForm.title}
                onChange={(e) => setPlaceForm({ ...placeForm, title: e.target.value })}
                placeholder="Например: Кофейня на углу"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place-category">Рубрика</Label>
              <Select
                value={placeForm.category}
                onValueChange={(value) => setPlaceForm({ ...placeForm, category: value })}
              >
                <SelectTrigger id="place-category">
                  <SelectValue placeholder="Выберите рубрику" />
                </SelectTrigger>
                <SelectContent>
                  {PLACE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: categoryColors[cat as keyof typeof categoryColors] }}
                        />
                        {cat}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-address">Адрес</Label>
            <Input
              id="place-address"
              value={placeForm.address}
              onChange={(e) => setPlaceForm({ ...placeForm, address: e.target.value })}
              placeholder="ул. Примерная, д. 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-excerpt">Краткое описание</Label>
            <Textarea
              id="place-excerpt"
              value={placeForm.excerpt}
              onChange={(e) => setPlaceForm({ ...placeForm, excerpt: e.target.value })}
              placeholder="Краткое описание места..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-content">Полное описание</Label>
            <Textarea
              id="place-content"
              value={placeForm.content}
              onChange={(e) => setPlaceForm({ ...placeForm, content: e.target.value })}
              placeholder="Подробная статья о месте..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place-image">URL изображения</Label>
            <Input
              id="place-image"
              value={placeForm.image_url}
              onChange={(e) => setPlaceForm({ ...placeForm, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Координаты на карте (кликните на карте)</Label>
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <MapContainer
                key={mapKey}
                center={mapPosition}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={mapPosition} onPositionChange={handleMapClick} />
              </MapContainer>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Широта: {placeForm.latitude.toFixed(6)}</span>
              <span>Долгота: {placeForm.longitude.toFixed(6)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="place-published"
              checked={placeForm.is_published}
              onCheckedChange={(checked) => setPlaceForm({ ...placeForm, is_published: checked })}
            />
            <Label htmlFor="place-published">Опубликовать сразу</Label>
          </div>

          <Button onClick={onPlaceSubmit} disabled={loading} className="w-full">
            {loading ? 'Сохранение...' : 'Добавить место'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список мест ({placesList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {placesList.map((place) => (
              <div
                key={place.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                {place.image_url && (
                  <img
                    src={place.image_url}
                    alt={place.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold">{place.title}</h3>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                    >
                      <Icon name="Heart" size={14} className="text-white fill-white" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{place.excerpt}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <Icon name="MapPin" size={12} />
                    {place.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded text-white"
                      style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                    >
                      {place.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      place.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {place.is_published ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTogglePublish(place.id, !place.is_published)}
                  >
                    <Icon name={place.is_published ? 'EyeOff' : 'Eye'} size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeletePlace(place.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {placesList.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Пока нет добавленных мест
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}