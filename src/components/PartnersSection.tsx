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
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden bg-gradient-to-br from-[#FF6B35]/10 via-[#FFD23F]/10 to-[#FF6B35]/5">
      <div className="bg-gradient-to-r from-[#FF6B35] via-[#FFD23F] to-[#FF6B35] px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-black p-3 border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Icon name="Sparkles" size={32} className="text-[#FFD23F]" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-black uppercase leading-[0.85] tracking-tighter [text-shadow:_3px_3px_0_rgb(255_255_255_/_50%)]">
                ПАРТНЁРЫ
              </h2>
            </div>
            <div className="h-2 w-24 md:w-40 bg-black"></div>
            <p className="text-black font-bold text-sm md:text-base mt-2 uppercase tracking-wide">Выгодные предложения для наших читателей</p>
          </div>
          <div className="hidden md:block bg-black p-4 border-4 border-primary shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Icon name="Gift" size={48} className="text-[#FFD23F]" />
          </div>
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

                <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F]">
                  <h3 className="text-white text-lg md:text-2xl font-black uppercase leading-tight tracking-tighter mb-2 md:mb-3 [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)] line-clamp-2">
                    {partner.name}
                  </h3>
                  
                  <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-3 md:mb-4">
                    {partner.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white font-black uppercase text-xs md:text-sm bg-black px-4 py-2 inline-flex border-2 border-white">
                    <Icon name="ExternalLink" size={16} />
                    Перейти на сайт
                  </div>
                </div>
              </div>
            </a>

            <div className="p-4 md:p-6 bg-white flex flex-col justify-between border-l-4 border-[#FFD23F]">
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