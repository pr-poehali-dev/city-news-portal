import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Partner {
  name: string;
  description: string;
  url: string;
  category: string;
  highlights: string[];
  logo?: string;
}

const partners: Partner[] = [
  {
    name: 'LaaKids',
    description: 'Агентство детских праздников полного цикла — от идеи до воплощения! Создаём яркие, запоминающиеся события для детей любого возраста.',
    url: 'https://laakids.ru',
    category: 'Детские праздники',
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
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/40 bg-gradient-to-br from-background via-primary/5 to-secondary/10"
          >
            <div className="grid md:grid-cols-[200px_1fr] gap-0">
              <div className="relative bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 flex items-center justify-center p-8 group overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 text-center">
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Icon name="PartyPopper" size={48} className="text-orange-500" />
                  </div>
                  <Badge className="bg-white text-orange-600 font-bold text-xs shadow-md">
                    {partner.category}
                  </Badge>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                      {partner.name}
                      <Icon name="ExternalLink" size={20} className="text-primary" />
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
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
