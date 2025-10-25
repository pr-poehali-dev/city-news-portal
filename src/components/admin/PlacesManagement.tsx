import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

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

declare global {
  interface Window {
    ymaps3: any;
  }
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
  const mapRef = useRef<HTMLDivElement>(null);
  const ymapInstance = useRef<any>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
    
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
        YMapListener,
      } = window.ymaps3;

      const center = [placeForm.longitude || 38.9753, placeForm.latitude || 45.0355];

      if (!ymapInstance.current) {
        ymapInstance.current = new YMap(mapRef.current, {
          location: {
            center,
            zoom: 12,
          },
        });

        ymapInstance.current.addChild(new YMapDefaultSchemeLayer());
        ymapInstance.current.addChild(new YMapDefaultFeaturesLayer());

        const listener = new YMapListener({
          onClick: (object: any, event: any) => {
            const coords = event.coordinates;
            setPlaceForm({
              ...placeForm,
              latitude: coords[1],
              longitude: coords[0],
            });
          },
        });

        ymapInstance.current.addChild(listener);
      }

      ymapInstance.current.update({ 
        location: { 
          center: [placeForm.longitude || 38.9753, placeForm.latitude || 45.0355],
          zoom: 12 
        } 
      });

      const existingMarkers = ymapInstance.current.children.filter((child: any) => 
        child instanceof YMapMarker
      );
      existingMarkers.forEach((marker: any) => {
        ymapInstance.current.removeChild(marker);
      });

      if (placeForm.latitude && placeForm.longitude) {
        const color = categoryColors[placeForm.category as keyof typeof categoryColors] || '#FF6B6B';
        
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div style="position: relative; width: 40px; height: 40px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" stroke-width="1"/>
            </svg>
          </div>
        `;

        const marker = new YMapMarker(
          {
            coordinates: [placeForm.longitude, placeForm.latitude],
          },
          markerElement
        );

        ymapInstance.current.addChild(marker);
      }
    };

    loadYandexMaps().catch(console.error);

    return () => {
      if (ymapInstance.current) {
        ymapInstance.current.destroy();
        ymapInstance.current = null;
      }
    };
  }, [placeForm.latitude, placeForm.longitude, placeForm.category]);

  const handleAddressSearch = async (query: string) => {
    if (query.length < 3) {
      setShowSuggestions(false);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=Краснодар, ${encodeURIComponent(query)}&format=json&results=5`
      );
      const data = await response.json();
      const suggestions = data.response.GeoObjectCollection.featureMember.map((item: any) => ({
        name: item.GeoObject.name,
        description: item.GeoObject.description,
        coordinates: item.GeoObject.Point.pos.split(' ').map(Number),
      }));
      setAddressSuggestions(suggestions);
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
                        address: `${suggestion.name}, ${suggestion.description}`,
                        latitude: suggestion.coordinates[1],
                        longitude: suggestion.coordinates[0]
                      });
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
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
              ref={mapRef} 
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
