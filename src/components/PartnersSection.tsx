import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Partner {
  name: string;
  description: string;
  url: string;
  category: string;
  highlights: string[];
  image: string;
  discount?: string;
}

const partners: Partner[] = [
  {
    name: 'LaaKids',
    description: 'Агентство стильных детских праздников полного цикла — от идеи до воплощения! Создаём яркие, незабываемые события для детей любого возраста.',
    url: 'https://laakids.ru',
    category: 'Детские праздники',
    image: 'https://cdn.poehali.dev/files/c6c405f0-2301-4754-b75f-625e2aa7b983.jpeg',
    discount: '500 ₽ скидка при переходе с «Город говорит»',
    highlights: [
      'Профессиональные аниматоры',
      'Уникальные сценарии',
      'Организация под ключ',
      'Выездные мероприятия'
    ]
  }
];

export const PartnersSection = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Handshake" size={32} className="text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Наши партнёры</h2>
      </div>
      
      <div className="grid gap-6">
        {partners.map((partner, idx) => (
          <Card 
            key={idx}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-4 border-transparent hover:border-pink-400 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 relative"
          >
            <div className="absolute top-4 right-4 animate-bounce">
              <Icon name="Sparkles" size={32} className="text-pink-500" />
            </div>
            <div className="absolute top-4 left-4">
              <Icon name="PartyPopper" size={28} className="text-orange-500" />
            </div>
            <div className="grid md:grid-cols-[380px_1fr] gap-0">
              <div className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-orange-400/20 z-10"></div>
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-pink-500/30 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-pink-500/30 to-transparent z-20"></div>
                <div className="absolute inset-0 border-8 border-pink-300/40 z-20 pointer-events-none"></div>
                <img 
                  src={partner.image} 
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: '50% 30%' }}
                />
                <div className="absolute top-3 left-3 z-30">
                  <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                    <Icon name="Gift" size={18} />
                    {partner.category}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {partner.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold">
                      {partner.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {partner.description}
                  </p>
                  {partner.discount && (
                    <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-2 border-orange-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-full">
                          <Icon name="Gift" size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-1">Специальное предложение!</p>
                          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                            {partner.discount}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {partner.highlights.map((highlight, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"></div>
                      <span className="text-foreground font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Icon name="Globe" size={20} />
                  Посетить сайт
                  <Icon name="ArrowRight" size={20} />
                </a>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Icon name="Star" size={14} className="text-orange-500" />
                    Проверенный партнёр портала «Город говорит»
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-dashed border-primary/30">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-full">
            <Icon name="Building2" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">
              Хотите стать нашим партнёром?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Расскажите о вашем бизнесе жителям Краснодара! Мы предлагаем выгодные условия размещения для местных компаний.
            </p>
            <a 
              href="/contacts"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              Связаться с нами
              <Icon name="Mail" size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};