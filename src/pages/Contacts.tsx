import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
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
        activeSection="Контакты"
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8 font-serif">
            Контакты
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="Mail" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a 
                      href="mailto:moskv.nickita@yandex.ru"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      moskv.nickita@yandex.ru
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="Phone" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Телефон</h3>
                    <a 
                      href="tel:+79111269639"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +7 (911) 126-96-39
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Адрес редакции</h3>
                    <p className="text-muted-foreground">
                      Краснодар, ул. Красная, 1
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="Clock" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Режим работы</h3>
                    <p className="text-muted-foreground">
                      Понедельник — Пятница<br />
                      9:00 — 18:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Социальные сети</h2>
              <p className="text-muted-foreground mb-6">
                Следите за новостями и общайтесь с нами в социальных сетях
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <a 
                  href="https://vk.com/club233389110" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">ВКонтакте</h3>
                    <p className="text-sm text-muted-foreground">@club233389110</p>
                  </div>
                </a>

                <a 
                  href="https://dzen.ru/govoritkrasnodar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="BookOpen" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Яндекс Дзен</h3>
                    <p className="text-sm text-muted-foreground">@govoritkrasnodar</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Для рекламодателей</h2>
              <p className="text-muted-foreground mb-4">
                По вопросам размещения рекламы и коммерческого сотрудничества обращайтесь:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-primary" />
                  <a 
                    href="mailto:moskv.nickita@yandex.ru"
                    className="text-primary hover:underline"
                  >
                    moskv.nickita@yandex.ru
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} className="text-primary" />
                  <a 
                    href="tel:+79111269639"
                    className="text-primary hover:underline"
                  >
                    +7 (911) 126-96-39
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Есть новость?</h2>
              <p className="text-muted-foreground mb-4">
                Если у вас есть интересная информация, которой вы хотите поделиться с жителями Краснодара, 
                напишите нам на почту или позвоните. Мы всегда рады сотрудничеству!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer 
        sections={sections} 
        onSectionChange={handleSectionChange} 
      />
    </div>
  );
};

export default Contacts;
