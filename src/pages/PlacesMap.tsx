import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import CityMap from '@/components/CityMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

const FUNCTIONS_URL = {
  cityPlaces: 'https://functions.poehali.dev/5db1b661-abf3-4bcb-8e1f-d01437219788',
  weather: 'https://functions.poehali.dev/5531fc0c-ecba-421c-bfb4-245613816060',
};

const categoryColors = {
  'Город завтракает': '#FF6B6B',
  'Город и кофе': '#8B4513',
  'Город поет': '#9B59B6',
  'Город танцует': '#3498DB',
};

export default function PlacesMap() {
  const navigate = useNavigate();
  const [cityPlaces, setCityPlaces] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('Главная');
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

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

  const handleSectionChange = (section: string) => {
    if (section === 'Главная') {
      navigate('/');
    } else if (section === 'О портале') {
      navigate('/about');
    } else if (section === 'Контакты') {
      navigate('/contacts');
    } else {
      setActiveSection(section);
      navigate('/');
    }
  };

  const categories = Array.from(new Set(cityPlaces.map(p => p.category)));

  const filteredByCategory = selectedCategory
    ? cityPlaces.filter(p => p.category === selectedCategory)
    : cityPlaces;

  const filteredPlaces = searchQuery
    ? filteredByCategory.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByCategory;

  const selectedPlace = selectedPlaceId
    ? cityPlaces.find(p => p.id === selectedPlaceId)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Карта мест — Город говорит</title>
        <meta name="description" content="Интерактивная карта интересных мест Краснодара" />
      </Helmet>

      <SiteHeader
        weather={weather}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">Карта мест</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/places')}
              className="gap-2"
            >
              <Icon name="List" size={16} />
              Списком
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск по названию, адресу или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
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
        </div>

        {searchQuery && (
          <div className="mb-4 text-sm text-muted-foreground">
            Найдено мест: {filteredPlaces.length}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="h-[calc(100vh-280px)] min-h-[500px] rounded-lg overflow-hidden">
            <CityMap 
              places={filteredPlaces} 
              onPlaceClick={(id) => setSelectedPlaceId(id)}
              interactive={true}
              height="100%"
            />
          </div>

          <div className="lg:max-h-[calc(100vh-280px)] overflow-y-auto">
            {selectedPlace ? (
              <Card className="mb-4">
                <CardContent className="p-0">
                  {selectedPlace.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={selectedPlace.image_url}
                        alt={selectedPlace.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: categoryColors[selectedPlace.category as keyof typeof categoryColors] }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-2xl font-bold">{selectedPlace.title}</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPlaceId(null)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Icon name="MapPin" size={14} />
                      <span>{selectedPlace.address}</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{selectedPlace.excerpt}</p>
                    {selectedPlace.content && (
                      <div className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: selectedPlace.content }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="MapPin" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Выберите место на карте</p>
                <p className="text-sm mt-2">Нажмите на маркер, чтобы увидеть подробности</p>
              </div>
            )}

            <div className="space-y-3">
              {filteredPlaces.slice(0, 5).map((place) => (
                <Card
                  key={place.id}
                  className={`cursor-pointer hover:shadow-lg transition-all ${selectedPlaceId === place.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPlaceId(place.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: categoryColors[place.category as keyof typeof categoryColors] }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate">{place.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer 
        sections={sections}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
}