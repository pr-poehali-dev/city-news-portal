import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  
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

  const handleSectionChange = (section: string) => {
    if (section === 'Главная') {
      navigate('/');
    } else if (section === 'Контакты') {
      navigate('/contacts');
    } else if (section === 'О портале') {
      navigate('/about');
    } else {
      navigate(`/?section=${section}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NewsTicker latestNews={[]} />
      
      <SiteHeader 
        sections={sections}
        activeSection="О портале"
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-primary mb-6 font-serif">
              О портале "Город говорит"
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                "Город говорит" — это современный новостной портал Краснодара, созданный для того, 
                чтобы держать вас в курсе всех важных событий нашего города.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Наша миссия</h2>
              <p className="text-muted-foreground mb-4">
                Мы стремимся предоставлять актуальную, достоверную и объективную информацию о жизни 
                Краснодара. Наша цель — быть вашим надёжным источником новостей о политике, экономике, 
                культуре, спорте и общественной жизни города.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Что мы освещаем</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                <li><strong>Политика</strong> — важные решения городской власти и общественные инициативы</li>
                <li><strong>Экономика</strong> — развитие бизнеса, новые проекты и экономические тенденции</li>
                <li><strong>Культура</strong> — выставки, концерты, театральные премьеры и культурные события</li>
                <li><strong>Спорт</strong> — достижения краснодарских спортсменов и спортивные мероприятия</li>
                <li><strong>События</strong> — городские праздники, фестивали и важные происшествия</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Специальные проекты</h2>
              <p className="text-muted-foreground mb-4">
                Мы гордимся нашими уникальными рубриками:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                <li><strong>Город завтракает</strong> — лучшие места для завтрака в Краснодаре</li>
                <li><strong>Город и кофе</strong> — обзоры кофеен и кофейной культуры города</li>
                <li><strong>Город поет</strong> — музыкальная жизнь и таланты Краснодара</li>
                <li><strong>Город танцует</strong> — танцевальные школы, мероприятия и культура</li>
                <li><strong>Город помнит</strong> — исторические события и память о важных датах</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Наша команда</h2>
              <p className="text-muted-foreground mb-4">
                В нашей редакции работают профессиональные журналисты, фотографы и редакторы, 
                которые ежедневно следят за событиями города и готовят для вас качественный контент.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Присоединяйтесь к нам</h2>
              <p className="text-muted-foreground mb-4">
                Следите за нашими новостями в социальных сетях:
              </p>
              <div className="flex gap-4 mb-6">
                <a 
                  href="https://vk.com/club233389110" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ВКонтакте
                </a>
                <a 
                  href="https://dzen.ru/govoritkrasnodar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Яндекс Дзен
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer 
        sections={sections} 
        onSectionChange={handleSectionChange} 
      />
    </div>
  );
};

export default About;
