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
      <div className="bg-[#FF6B35] px-4 md:px-8 py-6 md:py-8 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-2 md:mb-3">
              ПАРТНЁРЫ
            </h2>
            <div className="h-1 w-16 md:w-24 bg-[#FFD23F]"></div>
          </div>
          <Icon name="Handshake" size={32} className="text-white/30 flex-shrink-0 md:w-12 md:h-12" />
        </div>
      </div>

      <div className="grid gap-0">
        {partners.map((partner, idx) => (
          <div 
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b-4 border-primary bg-white"
          >
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-2 group relative overflow-hidden bg-white border-b-4 md:border-b-0 md:border-r-4 border-primary"
            >
              <div className="relative overflow-hidden bg-black">
                <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
                  <img 
                    src={partner.image} 
                    alt={partner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                    style={{ objectPosition: '50% 25%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="absolute top-3 left-3 md:top-6 md:left-6">
                    <div className="bg-[#FFD23F] px-4 py-2 rotate-[-2deg] border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-black font-black text-xs uppercase tracking-[0.2em]">
                        <Icon name="Star" size={14} className="inline mr-2" />
                        {partner.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-5 bg-black">
                  <h3 className="text-white text-lg md:text-xl font-black uppercase leading-tight tracking-tighter mb-2 line-clamp-2 group-hover:text-[#FF6B35] transition-colors">
                    {partner.name}
                  </h3>
                  
                  <p className="text-white/60 text-xs md:text-sm line-clamp-2">
                    {partner.description}
                  </p>
                </div>
              </div>
            </a>

            <div className="p-4 md:p-6 bg-white flex flex-col justify-between">
              {partner.discount && (
                <div className="mb-4">
                  <div className="mb-4 pb-4 border-b-4 border-[#FFD23F]">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Tag" size={20} className="text-[#FF6B35]" />
                      <div className="text-xs uppercase tracking-wider font-black text-[#FF6B35]">Специальное предложение</div>
                    </div>
                    <div className="text-lg md:text-xl font-black text-black bg-[#FFD23F]/20 p-3 border-2 border-[#FFD23F]">
                      {partner.discount}
                    </div>
                  </div>

                  {partner.promoCode && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon name="Ticket" size={18} className="text-[#FF6B35]" />
                        <div className="text-xs uppercase tracking-wider font-black text-[#FF6B35]">Промокод</div>
                      </div>
                      <div className="bg-black border-4 border-primary px-4 py-4 font-mono font-black text-xl text-center text-[#FFD23F] shadow-[4px_4px_0px_0px_rgba(255,107,53,1)]">
                        {partner.promoCode}
                      </div>
                      <button
                        onClick={() => copyPromoCode(partner.promoCode!)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] hover:from-[#FFD23F] hover:to-[#FF6B35] text-white font-black uppercase border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                      >
                        {copiedPromo === partner.promoCode ? (
                          <>
                            <Icon name="Check" size={18} />
                            Скопировано!
                          </>
                        ) : (
                          <>
                            <Icon name="Copy" size={18} />
                            Скопировать промокод
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2.5">
                {partner.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-[#FFD23F] border-2 border-primary flex-shrink-0 rotate-45"></div>
                    <span className="font-bold text-black">{highlight}</span>
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