import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const SocialSubscribe = () => {
  return (
    <div className="py-12 bg-gradient-to-br from-primary/5 via-orange-50/30 to-background dark:from-primary/10 dark:via-orange-950/20">
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

          <div className="grid md:grid-cols-3 gap-6">
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

            <a
              href="https://t.me/govoritkrasnodarn"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[#0088cc] to-[#006699] hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  Telegram
                </h3>
                <p className="text-white/90 text-sm mb-6">
                  Самые свежие новости и обсуждения в режиме реального времени
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