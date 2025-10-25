import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
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

export function PlacesManagement({
  placeForm,
  setPlaceForm,
  placesList,
  loading,
  onPlaceSubmit,
  onDeletePlace,
  onTogglePublish,
}: PlacesManagementProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
        setPlaceForm({
          ...placeForm,
          latitude: lat,
          longitude: lng,
        });
      });
    }

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    if (placeForm.latitude && placeForm.longitude) {
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

      markerRef.current = L.marker([placeForm.latitude, placeForm.longitude], { icon }).addTo(mapRef.current);
      mapRef.current.setView([placeForm.latitude, placeForm.longitude], 12);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [placeForm.latitude, placeForm.longitude]);

  const handleAddressSearch = async (query: string) => {
    if (query.length < 3) {
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=Краснодар, ${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setAddressSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
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

          <div className="space-y-2 relative">
            <Label htmlFor="place-address">Адрес</Label>
            <Input
              id="place-address"
              value={placeForm.address}
              onChange={(e) => {
                const value = e.target.value;
                setPlaceForm({ ...placeForm, address: value });
                handleAddressSearch(value);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="ул. Примерная, д. 1"
            />
            {showSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                {addressSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-2 hover:bg-accent cursor-pointer text-sm"
                    onClick={() => {
                      setPlaceForm({
                        ...placeForm,
                        address: suggestion.display_name,
                        latitude: parseFloat(suggestion.lat),
                        longitude: parseFloat(suggestion.lon)
                      });
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
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
            <Label htmlFor="place-image">Изображение</Label>
            <div className="flex gap-2">
              <Input
                id="place-image"
                value={placeForm.image_url}
                onChange={(e) => setPlaceForm({ ...placeForm, image_url: e.target.value })}
                placeholder="https://... или загрузите файл"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e: any) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    try {
                      const response = await fetch('/api/upload-image', {
                        method: 'POST',
                        body: formData
                      });
                      const data = await response.json();
                      setPlaceForm({ ...placeForm, image_url: data.url });
                    } catch (error) {
                      console.error('Upload failed:', error);
                    }
                  };
                  input.click();
                }}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Местоположение на карте (кликните на карту)</Label>
            <div 
              ref={containerRef} 
              style={{ height: '400px', width: '100%', borderRadius: '8px' }}
              className="border"
            />
            {placeForm.latitude && placeForm.longitude && (
              <p className="text-xs text-muted-foreground">
                Координаты: {placeForm.latitude.toFixed(6)}, {placeForm.longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
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
              <div key={place.id} className="flex items-start gap-4 p-4 border rounded-lg">
                {place.image_url && (
                  <img
                    src={place.image_url}
                    alt={place.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{place.title}</h3>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: categoryColors[place.category as keyof typeof categoryColors],
                        color: 'white'
                      }}
                    >
                      {place.category}
                    </span>
                    {!place.is_published && (
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                        Черновик
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{place.excerpt}</p>
                  <p className="text-xs text-muted-foreground">📍 {place.address}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTogglePublish(place.id, !place.is_published)}
                  >
                    {place.is_published ? 'Скрыть' : 'Опубликовать'}
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
                Нет добавленных мест
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
