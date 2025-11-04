import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
  const navigate = useNavigate();
  
  const sections = [
    'Главная',
    'СВО',
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
    <div className="min-h-screen bg-white">
      <NewsTicker latestNews={[]} />
      
      <SiteHeader 
        sections={sections}
        activeSection="Контакты"
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 md:mb-12">
            <div className="bg-accent px-6 py-4 border-4 border-primary inline-block mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                КОНТАКТЫ
              </h1>
            </div>
            <div className="h-2 w-32 bg-accent"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-accent p-3 border-2 border-primary">
                  <Icon name="Mail" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase mb-2 text-black">Email</h3>
                  <a 
                    href="mailto:moskv.nickita@yandex.ru"
                    className="text-black/70 hover:text-accent transition-colors font-bold"
                  >
                    moskv.nickita@yandex.ru
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-accent p-3 border-2 border-primary">
                  <Icon name="Phone" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase mb-2 text-black">Телефон</h3>
                  <a 
                    href="tel:+79111269639"
                    className="text-black/70 hover:text-accent transition-colors font-bold"
                  >
                    +7 (911) 126-96-39
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-accent p-3 border-2 border-primary">
                  <Icon name="MapPin" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase mb-2 text-black">Адрес редакции</h3>
                  <p className="text-black/70 font-bold">
                    Краснодар, ул. Красная, 1
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-accent p-3 border-2 border-primary">
                  <Icon name="Clock" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase mb-2 text-black">Режим работы</h3>
                  <p className="text-black/70 font-bold">
                    Понедельник — Пятница<br />
                    9:00 — 18:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent to-accent/80 border-4 border-primary p-6 md:p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-white flex items-center gap-3">
              <Icon name="Users" size={28} />
              Социальные сети
            </h2>
            <p className="text-white/90 mb-6 font-bold">
              Следите за новостями и общайтесь с нами в социальных сетях
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <a 
                href="https://vk.com/club233389110" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white hover:bg-black text-black hover:text-white p-4 border-4 border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-4"
              >
                <div className="bg-accent p-3 border-2 border-primary">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase">ВКонтакте</h3>
                  <p className="text-sm opacity-70 font-bold">@club233389110</p>
                </div>
              </a>

              <a 
                href="https://dzen.ru/govoritkrasnodar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white hover:bg-black text-black hover:text-white p-4 border-4 border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-4"
              >
                <div className="bg-accent p-3 border-2 border-primary">
                  <Icon name="Rss" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase">Яндекс Дзен</h3>
                  <p className="text-sm opacity-70 font-bold">@govoritkrasnodar</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-black border-4 border-primary p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-white flex items-center gap-3">
              <Icon name="Briefcase" size={28} className="text-accent" />
              Для рекламодателей
            </h2>
            <p className="text-white/90 mb-6 font-bold">
              По вопросам размещения рекламы и коммерческого сотрудничества обращайтесь:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white">
                <Icon name="Mail" size={20} className="text-accent" />
                <a 
                  href="mailto:moskv.nickita@yandex.ru"
                  className="text-white hover:text-accent transition-colors font-bold"
                >
                  moskv.nickita@yandex.ru
                </a>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Icon name="Phone" size={20} className="text-accent" />
                <a 
                  href="tel:+79111269639"
                  className="text-white hover:text-accent transition-colors font-bold"
                >
                  +7 (911) 126-96-39
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-accent/20 to-accent/10 border-4 border-primary p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-black flex items-center gap-3">
              <Icon name="Newspaper" size={28} className="text-accent" />
              Есть новость?
            </h2>
            <p className="text-black/80 font-bold leading-relaxed">
              Если у вас есть интересная информация, которой вы хотите поделиться с жителями Краснодара, 
              напишите нам на почту или позвоните. Мы всегда рады сотрудничеству!
            </p>
          </div>
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
