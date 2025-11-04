import { NewsTicker } from '@/components/NewsTicker';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const About = () => {
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
        activeSection="О портале"
        onSectionChange={handleSectionChange}
      />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 md:mb-12">
            <div className="bg-accent px-6 py-4 border-4 border-primary inline-block mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                О ПОРТАЛЕ
              </h1>
            </div>
            <div className="h-2 w-32 bg-accent"></div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white border-4 border-primary p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-lg md:text-xl text-black leading-relaxed">
                <span className="font-black text-accent">"Город говорит"</span> — это современный новостной портал Краснодара, созданный для того, 
                чтобы держать вас в курсе всех важных событий нашего города.
              </p>
            </div>

            <div className="border-l-4 border-accent pl-6 md:pl-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-black">Наша миссия</h2>
              <p className="text-black/80 leading-relaxed">
                Мы стремимся предоставлять актуальную, достоверную и объективную информацию о жизни 
                Краснодара. Наша цель — быть вашим надёжным источником новостей о политике, экономике, 
                культуре, спорте и общественной жизни города.
              </p>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-transparent border-4 border-primary p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 text-black flex items-center gap-3">
                <Icon name="Newspaper" size={32} className="text-accent" />
                Что мы освещаем
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: 'Landmark', title: 'Политика', desc: 'важные решения городской власти и общественные инициативы' },
                  { icon: 'TrendingUp', title: 'Экономика', desc: 'развитие бизнеса, новые проекты и экономические тенденции' },
                  { icon: 'Palette', title: 'Культура', desc: 'выставки, концерты, театральные премьеры и культурные события' },
                  { icon: 'Trophy', title: 'Спорт', desc: 'достижения краснодарских спортсменов и спортивные мероприятия' },
                  { icon: 'Calendar', title: 'События', desc: 'городские праздники, фестивали и важные происшествия' },
                  { icon: 'Shield', title: 'СВО', desc: 'новости о специальной военной операции и поддержка участников' }
                ].map((item, i) => (
                  <div key={i} className="bg-white border-2 border-primary p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start gap-3">
                      <Icon name={item.icon as any} size={24} className="text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-black uppercase text-black mb-1">{item.title}</h3>
                        <p className="text-sm text-black/70">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-accent pl-6 md:pl-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-black flex items-center gap-3">
                <Icon name="Star" size={28} className="text-accent" />
                Специальные проекты
              </h2>
              <p className="text-black/80 mb-4">
                Мы гордимся нашими уникальными рубриками:
              </p>
              <div className="space-y-3">
                {[
                  { name: 'Город завтракает', desc: 'лучшие места для завтрака в Краснодаре' },
                  { name: 'Город и кофе', desc: 'обзоры кофеен и кофейной культуры города' },
                  { name: 'Город поет', desc: 'музыкальная жизнь и таланты Краснодара' },
                  { name: 'Город танцует', desc: 'танцевальные школы, мероприятия и культура' },
                  { name: 'Город помнит', desc: 'исторические события и память о важных датах' }
                ].map((project, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-accent rotate-45 flex-shrink-0 mt-2"></div>
                    <div>
                      <span className="font-black text-black">{project.name}</span>
                      <span className="text-black/70"> — {project.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black border-4 border-primary p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-white flex items-center gap-3">
                <Icon name="Users" size={28} className="text-accent" />
                Наша команда
              </h2>
              <p className="text-white/90 leading-relaxed">
                В нашей редакции работают профессиональные журналисты, фотографы и редакторы, 
                которые ежедневно следят за событиями города и готовят для вас качественный контент.
              </p>
            </div>

            <div className="bg-gradient-to-r from-accent to-accent/80 border-4 border-primary p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-4 text-white flex items-center gap-3">
                <Icon name="Heart" size={28} />
                Присоединяйтесь к нам
              </h2>
              <p className="text-white/95 mb-6">
                Следите за нашими новостями в социальных сетях:
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://vk.com/club233389110" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-black text-black hover:text-white px-6 py-3 font-black uppercase border-2 border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  <Icon name="Users" size={18} />
                  ВКонтакте
                </a>
                <a 
                  href="https://dzen.ru/govoritkrasnodar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-black text-black hover:text-white px-6 py-3 font-black uppercase border-2 border-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  <Icon name="Rss" size={18} />
                  Яндекс Дзен
                </a>
              </div>
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
};

export default About;
