import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Partner {
  name: string;
  description: string;
  url: string;
  category: string;
  highlights: string[];
  image: string;
  discount?: string;
  promoCode?: string;
}

const partners: Partner[] = [
  {
    name: 'LaaKids',
    description: 'Агентство стильных детских праздников полного цикла — от идеи до воплощения! Создаём яркие, незабываемые события для детей любого возраста.',
    url: 'https://laakids.ru',
    category: 'Детские праздники',
    image: 'https://cdn.poehali.dev/files/c6c405f0-2301-4754-b75f-625e2aa7b983.jpeg',
    discount: '500 ₽ скидка при переходе с «Город говорит»',
    promoCode: 'Праздник500',
    highlights: [
      'Профессиональные аниматоры',
      'Уникальные сценарии',
      'Организация под ключ',
      'Выездные мероприятия'
    ]
  }
];

const Confetti = () => {
  const colors = ['#FF6B9D', '#C44569', '#FFA502', '#FF6348', '#A55EEA'];
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export const PartnersSection = () => {
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromo(code);
    setTimeout(() => setCopiedPromo(null), 2000);
  };

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
            onMouseEnter={() => setShowConfetti(true)}
            onMouseLeave={() => setShowConfetti(false)}
          >
            {showConfetti && <Confetti />}
            
            <div className="absolute top-4 right-4 animate-bounce z-40">
              <Icon name="Sparkles" size={32} className="text-pink-500 drop-shadow-lg" />
            </div>
            <div className="absolute top-4 left-4 z-40 animate-pulse">
              <Icon name="PartyPopper" size={32} className="text-orange-500 drop-shadow-lg" />
            </div>
            <div className="absolute top-12 right-16 z-40 animate-bounce" style={{ animationDelay: '0.3s' }}>
              <Icon name="Heart" size={24} className="text-red-500 fill-red-500 drop-shadow-lg" />
            </div>
            
            <div className="grid md:grid-cols-[320px_1fr] gap-0">
              <div className="relative overflow-hidden group h-[280px] md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-orange-400/20 z-10"></div>
                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-pink-500/40 to-transparent z-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-orange-500/40 to-transparent z-20"></div>
                <div className="absolute inset-0 border-8 border-pink-300/50 z-20 pointer-events-none shadow-inner"></div>
                <div className="absolute top-2 left-2 right-2 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-full z-20"></div>
                <div className="absolute bottom-2 left-2 right-2 h-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full z-20"></div>
                <img 
                  src={partner.image} 
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  style={{ objectPosition: '50% 25%' }}
                />
                <div className="absolute top-3 left-3 z-30 animate-pulse">
                  <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 border-2 border-white">
                    <Icon name="Gift" size={18} />
                    {partner.category}
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-30">
                  <Icon name="Star" className="text-yellow-400 fill-yellow-400 animate-bounce" size={24} />
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
                      <div className="flex items-start justify-between gap-3">
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
                      {partner.promoCode && (
                        <div className="mt-3 pt-3 border-t border-orange-300/30">
                          <p className="text-xs text-muted-foreground mb-2">Промокод для скидки:</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white border-2 border-dashed border-pink-400 rounded-lg px-4 py-2 font-mono font-bold text-lg text-center text-pink-600">
                              {partner.promoCode}
                            </div>
                            <button
                              onClick={() => copyPromoCode(partner.promoCode!)}
                              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                              {copiedPromo === partner.promoCode ? (
                                <>
                                  <Icon name="Check" size={18} />
                                  Скопировано
                                </>
                              ) : (
                                <>
                                  <Icon name="Copy" size={18} />
                                  Скопировать
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
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