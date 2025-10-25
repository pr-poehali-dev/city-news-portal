import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { PlaceDialog } from '@/components/PlaceDialog';

const FUNCTIONS_URL = {
  cityPlaces: 'https://functions.poehali.dev/5db1b661-abf3-4bcb-8e1f-d01437219788',
  weather: 'https://functions.poehali.dev/5531fc0c-ecba-421c-bfb4-245613816060'
};

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

const Places = () => {
  const navigate = useNavigate();
  const [cityPlaces, setCityPlaces] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('Город говорит');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sections = [
    'Главная',
    'Политика',
    'Экономика',
    'Культура',
    'Спорт',
    'События',
    'О портале',
    'Контакты'
  ];

  useEffect(() => {
    loadCityPlaces();
    loadWeather();
  }, []);

  const loadCityPlaces = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces);
      const data = await response.json();
      setCityPlaces(data.filter((p: any) => p.is_published));
    } catch (error) {
      console.error('Failed to load city places:', error);
    }
  };

  const loadWeather = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.weather);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
    }
  };

  const categories = Array.from(new Set(cityPlaces.map(p => p.category)));
  const filteredPlaces = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;

  const featuredPlaces = filteredPlaces.filter(p => p.is_featured);
  const regularPlaces = filteredPlaces.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        weather={weather}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={(section) => {
          if (section === 'Главная') {
            navigate('/');
          } else {
            setActiveSection(section);
          }
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Город говорит</h1>
              <p className="text-muted-foreground">Все места городской жизни Краснодара</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/places/map')}
              className="gap-2"
            >
              <Icon name="Map" size={16} />
              На карте
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Все
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors[cat as keyof typeof categoryColors] }}
              />
              {cat}
            </Button>
          ))}
        </div>

        {featuredPlaces.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⭐</span>
              <span>Город оценил</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {featuredPlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => { setSelectedPlace(place); setDialogOpen(true); }}>
                  <CardContent className="p-0">
                    {place.image_url && (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={place.image_url}
                          alt={place.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <span>⭐</span>
                          <span>Город оценил</span>
                        </div>
                        <div
                          className="absolute top-4 left-4 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{place.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Icon name="MapPin" size={14} />
                        <span>{place.address}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3">{place.excerpt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {regularPlaces.length > 0 && (
          <div>
            {featuredPlaces.length > 0 && (
              <h2 className="text-2xl font-bold mb-4">Все места</h2>
            )}
            <div className="grid sm:grid-cols-2 gap-6">
              {regularPlaces.map((place) => (
                <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => { setSelectedPlace(place); setDialogOpen(true); }}>
                  <CardContent className="p-0">
                    {place.image_url && (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={place.image_url}
                          alt={place.title}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                          style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{place.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Icon name="MapPin" size={14} />
                        <span>{place.address}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3">{place.excerpt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Мест в этой категории пока нет</p>
          </div>
        )}
      </main>

      <Footer 
        sections={sections}
        onSectionChange={(section) => {
          if (section === 'Главная') {
            navigate('/');
          } else {
            setActiveSection(section);
          }
        }}
      />

      <PlaceDialog
        place={selectedPlace}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoryColor={selectedPlace ? categoryColors[selectedPlace.category as keyof typeof categoryColors] : undefined}
      />
    </div>
  );
};

export default Places;