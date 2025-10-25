import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const SocialSubscribe = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-primary/5 via-orange-50/30 to-background dark:from-primary/10 dark:via-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Будьте в курсе событий!
            </h2>
            <p className="text-muted-foreground text-lg">
              Подписывайтесь на наши каналы и получайте актуальные новости Краснодара
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://vk.com/club233389110"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#0077FF] to-[#0055CC] hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.81 13.33h-1.84c-.56 0-.73-.45-1.73-1.45-.87-.83-1.26-.94-1.48-.94-.3 0-.39.09-.39.52v1.32c0 .36-.11.57-1.07.57-1.58 0-3.33-.96-4.56-2.75-1.84-2.62-2.34-4.58-2.34-4.98 0-.22.09-.43.52-.43h1.84c.39 0 .54.18.69.6.77 2.19 2.06 4.11 2.59 4.11.2 0 .29-.09.29-.59v-2.29c-.06-1.01-.59-1.1-.59-1.46 0-.18.15-.36.39-.36h2.89c.33 0 .45.18.45.56v3.09c0 .33.15.45.24.45.2 0 .36-.12.72-.48 1.1-1.24 1.89-3.15 1.89-3.15.1-.22.28-.43.71-.43h1.84c.55 0 .67.28.55.66-.21.94-2.29 3.65-2.29 3.65-.17.27-.23.39 0 .71.17.23.73.71 1.1 1.14.67.73 1.19 1.34 1.33 1.77.13.42-.08.64-.51.64z"/>
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  ВКонтакте
                </h3>
                <p className="text-white/90 text-sm mb-6">
                  Новости, фото, обсуждения и эксклюзивные материалы о жизни Краснодара
                </p>

                <div className="flex items-center">
                  <span className="text-white font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Подписаться
                    <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>

            <a
              href="https://dzen.ru/govoritkrasnodar"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-black via-gray-900 to-gray-800 hover:shadow-2xl hover:shadow-black/50 transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  Яндекс.Дзен
                </h3>
                <p className="text-white/90 text-sm mb-6">
                  Аналитика, глубокие материалы и истории о Краснодаре и крае
                </p>

                <div className="flex items-center">
                  <span className="text-white font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Подписаться
                    <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          </div>


        </div>
      </div>
    </div>
  );
};