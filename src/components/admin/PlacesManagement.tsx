import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceFormFields } from './places/PlaceFormFields';
import { PlaceMap } from './places/PlaceMap';
import { PlacesList } from './places/PlacesList';

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

  const handleAddressChange = (value: string) => {
    setPlaceForm({ ...placeForm, address: value });
    handleAddressSearch(value);
  };

  const handleSuggestionsBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setPlaceForm({
      ...placeForm,
      address: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon)
    });
    setShowSuggestions(false);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPlaceForm({
      ...placeForm,
      latitude: lat,
      longitude: lng,
    });
  };

  const isEditMode = placeForm.title && placesList.some(p => 
    p.title === placeForm.title && 
    p.address === placeForm.address
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Редактировать место' : 'Добавить место'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PlaceFormFields
            placeForm={placeForm}
            setPlaceForm={setPlaceForm}
            addressSuggestions={addressSuggestions}
            showSuggestions={showSuggestions}
            onAddressChange={handleAddressChange}
            onSuggestionsBlur={handleSuggestionsBlur}
            onSuggestionSelect={handleSuggestionSelect}
          />

          <PlaceMap
            placeForm={placeForm}
            onMapClick={handleMapClick}
          />

          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!loading) onUpdatePlace();
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Обновление...' : 'Обновить место'}
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPlaceForm({
                      title: '',
                      excerpt: '',
                      content: '',
                      category: '',
                      latitude: 0,
                      longitude: 0,
                      address: '',
                      image_url: '',
                      is_published: false,
                      is_featured: false,
                    });
                  }}
                >
                  Отменить
                </Button>
              </>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!loading) onPlaceSubmit();
                }}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Добавление...' : 'Добавить место'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <PlacesList
        places={placesList}
        filterFeatured={filterFeatured}
        onFilterChange={setFilterFeatured}
        onEdit={onEditPlace}
        onDelete={onDeletePlace}
        onTogglePublish={onTogglePublish}
        onToggleFeatured={onToggleFeatured}
      />
    </div>
  );
}
