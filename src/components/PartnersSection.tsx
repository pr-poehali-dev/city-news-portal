import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';
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
    <section id="partner" className="py-32 px-6 lg:px-20 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-20">
          <h2 className="text-6xl lg:text-8xl font-black mb-6 tracking-tight">
            Партнёры
          </h2>
          <p className="text-gray-500 text-2xl font-light">
            Эксклюзивные предложения для наших читателей
          </p>
        </div>

        {partners.map((partner, idx) => (
          <MagneticCard key={idx} className="mb-12">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-[400px] lg:h-auto overflow-hidden group">
                  <img 
                    src={partner.image} 
                    alt={partner.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-8">
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                      {partner.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-between min-h-[500px]">
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight">
                      {partner.name}
                    </h3>
                    <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                      {partner.description}
                    </p>
                  </div>

                  {partner.discount && (
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 mb-6">
                      <div className="flex flex-col gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Icon name="Gift" size={24} className="text-white" />
                          </div>
                          <p className="text-xl lg:text-2xl font-bold text-gray-900">
                            {partner.discount}
                          </p>
                        </div>
                      </div>
                      
                      {partner.promoCode && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="flex-1 bg-white rounded-xl px-4 py-3 font-mono font-bold text-lg lg:text-xl text-center text-pink-600 border-2 border-dashed border-pink-300">
                            {partner.promoCode}
                          </div>
                          <button
                            onClick={() => copyPromoCode(partner.promoCode!)}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                          >
                            {copiedPromo === partner.promoCode ? (
                              <>
                                <Icon name="Check" size={18} />
                                Готово
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

                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-base lg:text-lg px-8 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Перейти на сайт
                    <Icon name="ExternalLink" size={20} />
                  </a>
                </div>
              </div>
            </div>
          </MagneticCard>
        ))}
      </div>
    </section>
  );
};