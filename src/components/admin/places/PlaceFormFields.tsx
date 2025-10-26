import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { ImageUpload } from '@/components/admin/ImageUpload';

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

interface PlaceFormFieldsProps {
  placeForm: PlaceForm;
  setPlaceForm: (form: PlaceForm) => void;
  addressSuggestions: any[];
  showSuggestions: boolean;
  onAddressChange: (value: string) => void;
  onSuggestionsBlur: () => void;
  onSuggestionSelect: (suggestion: any) => void;
}

export function PlaceFormFields({
  placeForm,
  setPlaceForm,
  addressSuggestions,
  showSuggestions,
  onAddressChange,
  onSuggestionsBlur,
  onSuggestionSelect,
}: PlaceFormFieldsProps) {
  return (
    <div className="space-y-4">
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
          onChange={(e) => onAddressChange(e.target.value)}
          onBlur={onSuggestionsBlur}
          placeholder="ул. Примерная, д. 1"
        />
        {showSuggestions && addressSuggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-background border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {addressSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-2 hover:bg-accent cursor-pointer text-sm"
                onClick={() => onSuggestionSelect(suggestion)}
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
          placeholder="Уютное место в центре города"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="place-content">Подробное описание</Label>
        <Textarea
          id="place-content"
          value={placeForm.content}
          onChange={(e) => setPlaceForm({ ...placeForm, content: e.target.value })}
          placeholder="Полное описание заведения"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="place-lat">Широта</Label>
          <Input
            id="place-lat"
            type="number"
            step="0.000001"
            value={placeForm.latitude || ''}
            onChange={(e) => setPlaceForm({ ...placeForm, latitude: parseFloat(e.target.value) || 0 })}
            placeholder="45.035470"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="place-lng">Долгота</Label>
          <Input
            id="place-lng"
            type="number"
            step="0.000001"
            value={placeForm.longitude || ''}
            onChange={(e) => setPlaceForm({ ...placeForm, longitude: parseFloat(e.target.value) || 0 })}
            placeholder="38.975313"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="place-image">Изображение</Label>
        <ImageUpload
          value={placeForm.image_url}
          onChange={(url) => setPlaceForm({ ...placeForm, image_url: url })}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={placeForm.is_published}
            onCheckedChange={(checked) => setPlaceForm({ ...placeForm, is_published: checked })}
          />
          <Label>Опубликовано</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={placeForm.is_featured}
            onCheckedChange={(checked) => setPlaceForm({ ...placeForm, is_featured: checked })}
          />
          <Label className="flex items-center gap-1">
            <Icon name="Star" size={14} className="text-yellow-500" />
            В избранном
          </Label>
        </div>
      </div>
    </div>
  );
}
