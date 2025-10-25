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
  is_featured: boolean;
}

interface PlacesManagementProps {
  placeForm: PlaceForm;
  setPlaceForm: (form: PlaceForm) => void;
  placesList: any[];
  loading: boolean;
  onPlaceSubmit: () => void;
  onDeletePlace: (id: number) => void;
  onTogglePublish: (id: number, isPublished: boolean) => void;
  onToggleFeatured: (id: number, isFeatured: boolean) => void;
  onEditPlace: (place: any) => void;
  onUpdatePlace: () => void;
}

export function PlacesManagement({
  placeForm,
  setPlaceForm,
  placesList,
  loading,
  onPlaceSubmit,
  onDeletePlace,
  onTogglePublish,
  onToggleFeatured,
  onEditPlace,
  onUpdatePlace,
}: PlacesManagementProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all');
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
  }, [placeForm.latitude, placeForm.longitude, placeForm.is_featured, placeForm.category]);

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
                    
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const base64 = reader.result as string;
                      try {
                        const response = await fetch('https://functions.poehali.dev/bc882f30-e97a-4dcc-aca0-a79cffa9bd71', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ image: base64, filename: file.name })
                        });
                        const data = await response.json();
                        if (data.url) {
                          setPlaceForm({ ...placeForm, image_url: data.url });
                        }
                      } catch (error) {
                        console.error('Upload failed:', error);
                      }
                    };
                    reader.readAsDataURL(file);
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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Switch
                id="place-published"
                checked={placeForm.is_published}
                onCheckedChange={(checked) => setPlaceForm({ ...placeForm, is_published: checked })}
              />
              <Label htmlFor="place-published">Опубликовать сразу</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="place-featured"
                checked={placeForm.is_featured}
                onCheckedChange={(checked) => setPlaceForm({ ...placeForm, is_featured: checked })}
              />
              <Label htmlFor="place-featured" className="flex items-center gap-2">
                <span>⭐</span>
                <span>Город оценил (золотой маркер)</span>
              </Label>
            </div>
          </div>

          <Button 
            onClick={placeForm.id ? onUpdatePlace : onPlaceSubmit} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? 'Сохранение...' : (placeForm.id ? 'Обновить место' : 'Добавить место')}
          </Button>
          {placeForm.id && (
            <Button 
              onClick={() => setPlaceForm({
                title: '',
                excerpt: '',
                content: '',
                category: 'Город завтракает',
                latitude: 45.0355,
                longitude: 38.9753,
                address: '',
                image_url: '',
                is_published: false,
                is_featured: false
              })} 
              variant="outline" 
              className="w-full"
            >
              Отменить редактирование
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">Список мест ({placesList.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterFeatured === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterFeatured('all')}
                className="text-xs sm:text-sm"
              >
                Все
              </Button>
              <Button
                variant={filterFeatured === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterFeatured('featured')}
                className={`text-xs sm:text-sm ${filterFeatured === 'featured' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
              >
                ⭐ Оценил
              </Button>
              <Button
                variant={filterFeatured === 'regular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterFeatured('regular')}
                className="text-xs sm:text-sm"
              >
                Обычные
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {placesList
              .filter(place => {
                if (filterFeatured === 'featured') return place.is_featured;
                if (filterFeatured === 'regular') return !place.is_featured;
                return true;
              })
              .map((place) => (
              <div key={place.id} className="flex flex-col sm:flex-row items-start gap-3 p-3 sm:p-4 border rounded-lg bg-card">
                {place.image_url && (
                  <img
                    src={place.image_url}
                    alt={place.title}
                    className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-sm sm:text-base break-words">{place.title}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded whitespace-nowrap"
                      style={{
                        backgroundColor: categoryColors[place.category as keyof typeof categoryColors],
                        color: 'white'
                      }}
                    >
                      {place.category}
                    </span>
                    {!place.is_published && (
                      <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                        Черновик
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 line-clamp-2">{place.excerpt}</p>
                  <p className="text-xs text-muted-foreground truncate">📍 {place.address}</p>
                </div>
                <div className="flex sm:flex-col gap-2 flex-wrap w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPlace(place)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    <Icon name="Edit" size={14} className="sm:mr-1" />
                    <span className="hidden sm:inline">Редактировать</span>
                  </Button>
                  <Button
                    variant={place.is_featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggleFeatured(place.id, !place.is_featured)}
                    className={`flex-1 sm:flex-none text-xs ${place.is_featured ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                  >
                    <span>⭐</span>
                    <span className="hidden sm:inline ml-1">{place.is_featured ? 'Убрать' : 'Оценил'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTogglePublish(place.id, !place.is_published)}
                    className="flex-1 sm:flex-none text-xs"
                  >
                    {place.is_published ? 'Скрыть' : 'Опубликовать'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeletePlace(place.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
            {placesList.filter(place => {
              if (filterFeatured === 'featured') return place.is_featured;
              if (filterFeatured === 'regular') return !place.is_featured;
              return true;
            }).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {filterFeatured === 'featured' ? 'Нет мест с отметкой "Город оценил"' : 
                 filterFeatured === 'regular' ? 'Нет обычных мест' : 
                 'Нет добавленных мест'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}