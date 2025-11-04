import { Card } from '@/components/ui/card';
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

export const PartnersSection = () => {
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromo(code);
    setTimeout(() => setCopiedPromo(null), 2000);
  };

  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-[#2ECC40] px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              ПАРТНЁРЫ
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-white"></div>
          </div>
          <Icon name="Handshake" size={48} className="text-white/30 flex-shrink-0 md:w-16 md:h-16" />
        </div>
      </div>

      <div className="grid gap-0">
        {partners.map((partner, idx) => (
          <div 
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b-4 border-primary"
          >
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-2 group relative overflow-hidden bg-white border-b-4 md:border-b-0 md:border-r-4 border-primary"
            >
              <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-black">
                <img 
                  src={partner.image} 
                  alt={partner.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  style={{ objectPosition: '50% 25%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                <div className="absolute top-3 left-3 md:top-6 md:left-6">
                  <div className="bg-[#2ECC40] px-4 py-2 rotate-[-2deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-white font-black text-xs uppercase tracking-[0.2em]">
                      <Icon name="Gift" size={14} className="inline mr-2" />
                      {partner.category}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 lg:p-8">
                  <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-black uppercase leading-tight tracking-tighter mb-2 md:mb-3 group-hover:text-[#2ECC40] transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                    {partner.name}
                  </h3>
                  
                  <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-3 md:mb-4 hidden md:block">
                    {partner.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-black uppercase text-xs">
                    <Icon name="ExternalLink" size={16} />
                    Перейти на сайт
                  </div>
                </div>
              </div>
            </a>

            <div className="p-4 md:p-6 bg-white flex flex-col justify-between">
              {partner.discount && (
                <div className="mb-4">
                  <div className="mb-3 pb-3 border-b-2 border-primary">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Специальное предложение</div>
                    <div className="text-lg font-black text-[#2ECC40]">{partner.discount}</div>
                  </div>

                  {partner.promoCode && (
                    <div className="space-y-2">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Промокод</div>
                      <div className="bg-[#F5F5F5] border-2 border-primary px-4 py-3 font-mono font-black text-lg text-center">
                        {partner.promoCode}
                      </div>
                      <button
                        onClick={() => copyPromoCode(partner.promoCode!)}
                        className="w-full px-4 py-3 bg-[#2ECC40] hover:bg-[#27AE38] text-white font-black uppercase border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
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
                  )}
                </div>
              )}

              <div className="space-y-2">
                {partner.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-[#2ECC40] border border-primary flex-shrink-0"></div>
                    <span className="font-bold">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};