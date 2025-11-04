import Icon from '@/components/ui/icon';

const socials = [
  {
    name: 'ВК',
    url: 'https://vk.com/club233389110',
    icon: 'vk',
    color: '#0077FF'
  },
  {
    name: 'ДЗЕН',
    url: 'https://dzen.ru/govoritkrasnodar',
    icon: 'compass',
    color: '#FF6B35'
  },
  {
    name: 'TG',
    url: 'https://t.me/govoritkrasnodarn',
    icon: 'send',
    color: '#0088cc'
  }
];

export const SocialSubscribe = () => {
  return (
    <section className="mb-0 border-t-4 border-primary max-w-full overflow-hidden">
      <div className="bg-black px-4 md:px-8 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase leading-[0.85] tracking-tighter mb-3 md:mb-4">
              МЫ В СЕТИ
            </h2>
            <div className="h-1 md:h-2 w-20 md:w-32 bg-accent"></div>
          </div>
          <Icon name="Share2" size={48} className="text-accent/30 flex-shrink-0 md:w-16 md:h-16" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {socials.map((social, index) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden bg-white border-b-4 ${
              index < 2 ? 'md:border-r-4' : ''
            } border-primary transition-all hover:z-10 hover:bg-black`}
          >
            <div className="aspect-[4/3] relative flex items-center justify-center p-8">
              <div className="text-center">
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 border-4 border-primary flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none"
                  style={{ backgroundColor: social.color }}
                >
                  {social.icon === 'vk' && (
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.81 13.33h-1.84c-.56 0-.73-.45-1.73-1.45-.87-.83-1.26-.94-1.48-.94-.3 0-.39.09-.39.52v1.32c0 .36-.11.57-1.07.57-1.58 0-3.33-.96-4.56-2.75-1.84-2.62-2.34-4.58-2.34-4.98 0-.22.09-.43.52-.43h1.84c.39 0 .54.18.69.6.77 2.19 2.06 4.11 2.59 4.11.2 0 .29-.09.29-.59v-2.29c-.06-1.01-.59-1.1-.59-1.46 0-.18.15-.36.39-.36h2.89c.33 0 .45.18.45.56v3.09c0 .33.15.45.24.45.2 0 .36-.12.72-.48 1.1-1.24 1.89-3.15 1.89-3.15.1-.22.28-.43.71-.43h1.84c.55 0 .67.28.55.66-.21.94-2.29 3.65-2.29 3.65-.17.27-.23.39 0 .71.17.23.73.71 1.1 1.14.67.73 1.19 1.34 1.33 1.77.13.42-.08.64-.51.64z"/>
                    </svg>
                  )}
                  {social.icon === 'compass' && (
                    <Icon name="Compass" size={48} className="text-white md:w-16 md:h-16" />
                  )}
                  {social.icon === 'send' && (
                    <Icon name="Send" size={48} className="text-white md:w-16 md:h-16" />
                  )}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-black group-hover:text-white uppercase tracking-tighter mb-3 transition-colors">
                  {social.name}
                </h3>
                
                <div className="flex items-center justify-center gap-2 text-black group-hover:text-accent font-black uppercase text-sm transition-colors">
                  Подписаться
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
