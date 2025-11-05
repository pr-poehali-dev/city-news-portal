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
      <div className="bg-black px-6 md:px-12 py-8 md:py-12 border-b-4 border-primary">
        <div className="flex items-center gap-3">
          <Icon name="Share2" size={32} className="text-accent flex-shrink-0 md:w-12 md:h-12" />
          <div className="min-w-0">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter">
              МЫ В СЕТИ
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-white divide-y-2 divide-gray-200 border-b-4 border-primary">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 md:p-6 hover:bg-gray-50 transition-colors"
          >
            <div 
              className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border-4 border-primary flex items-center justify-center transition-all group-hover:scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: social.color }}
            >
              {social.icon === 'vk' && (
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.81 13.33h-1.84c-.56 0-.73-.45-1.73-1.45-.87-.83-1.26-.94-1.48-.94-.3 0-.39.09-.39.52v1.32c0 .36-.11.57-1.07.57-1.58 0-3.33-.96-4.56-2.75-1.84-2.62-2.34-4.58-2.34-4.98 0-.22.09-.43.52-.43h1.84c.39 0 .54.18.69.6.77 2.19 2.06 4.11 2.59 4.11.2 0 .29-.09.29-.59v-2.29c-.06-1.01-.59-1.1-.59-1.46 0-.18.15-.36.39-.36h2.89c.33 0 .45.18.45.56v3.09c0 .33.15.45.24.45.2 0 .36-.12.72-.48 1.1-1.24 1.89-3.15 1.89-3.15.1-.22.28-.43.71-.43h1.84c.55 0 .67.28.55.66-.21.94-2.29 3.65-2.29 3.65-.17.27-.23.39 0 .71.17.23.73.71 1.1 1.14.67.73 1.19 1.34 1.33 1.77.13.42-.08.64-.51.64z"/>
                </svg>
              )}
              {social.icon === 'compass' && (
                <Icon name="Compass" size={32} className="text-white md:w-10 md:h-10" />
              )}
              {social.icon === 'send' && (
                <Icon name="Send" size={32} className="text-white md:w-10 md:h-10" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight mb-1 group-hover:text-accent transition-colors">
                {social.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-wide">
                Подписаться на канал
              </p>
            </div>
            
            <Icon name="ArrowRight" size={24} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
};