import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface FooterProps {
  sections?: string[];
  onSectionChange?: (section: string) => void;
}

export const Footer = ({ sections = [], onSectionChange }: FooterProps) => {
  return (
    <footer className="bg-gray-900 mt-16">
      <div className="container mx-auto px-8 py-20">
        <div className="grid md:grid-cols-4 gap-16">
          <div>
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="absolute -inset-2 bg-gradient-to-r from-accent via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
                <h3 className="relative text-3xl font-display font-bold bg-gradient-to-r from-accent via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Город Говорит
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-8">
              Краснодар • 2025
            </p>
            <div className="flex gap-4">
              <a 
                href="https://vk.com/club233389110" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-purple-600 hover:shadow-lg hover:shadow-accent/50 text-white flex items-center justify-center transition-all hover:scale-110" 
                title="ВКонтакте"
              >
                <Icon name="Users" size={20} />
              </a>
              <a 
                href="https://dzen.ru/govoritkrasnodar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50 text-white flex items-center justify-center transition-all hover:scale-110" 
                title="Яндекс Дзен"
              >
                <Icon name="BookOpen" size={20} />
              </a>
            </div>
          </div>

          {sections.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-white mb-6 text-lg">Разделы</h4>
              <ul className="space-y-4 text-sm">
                {sections.slice(0, 6).map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => onSectionChange?.(section)}
                      className="text-gray-400 hover:text-accent transition-colors font-medium hover:translate-x-1 inline-block"
                    >
                      → {section}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <div className="h-1 w-16 bg-accent mb-6"></div>
            <h4 className="font-black text-white mb-8 uppercase text-lg tracking-widest">СОЦСЕТИ</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a 
                  href="https://vk.com/club233389110" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-accent transition-all flex items-center gap-3 font-black uppercase tracking-wider group"
                >
                  <Icon name="Users" size={18} className="group-hover:scale-125 transition-transform" />
                  ВКОНТАКТЕ
                </a>
              </li>
              <li>
                <a 
                  href="https://dzen.ru/govoritkrasnodar" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-accent transition-all flex items-center gap-3 font-black uppercase tracking-wider group"
                >
                  <Icon name="BookOpen" size={18} className="group-hover:scale-125 transition-transform" />
                  ЯНДЕКС ДЗЕН
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="h-1 w-16 bg-accent mb-6"></div>
            <h4 className="font-black text-white mb-8 uppercase text-lg tracking-widest">КОНТАКТЫ</h4>
            <ul className="space-y-4 text-sm text-white/70 font-bold">
              <li className="flex items-start gap-3">
                <Icon name="Mail" size={18} className="mt-0.5 flex-shrink-0" />
                <span>moskv.nickita@yandex.ru</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Phone" size={18} className="mt-0.5 flex-shrink-0" />
                <span>+7 (911) 126-96-39</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="MapPin" size={18} className="mt-0.5 flex-shrink-0" />
                <span>Краснодар, ул. Красная, 1</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Rss" size={18} className="mt-0.5 flex-shrink-0" />
                <a 
                  href="https://functions.poehali.dev/ca2cee13-dce4-42ea-8fb9-2b5c115b07dc?feed_type=news" 
                  className="hover:text-accent transition-colors uppercase tracking-wider" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  RSS НОВОСТИ
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="Rss" size={18} className="mt-0.5 flex-shrink-0" />
                <a 
                  href="https://functions.poehali.dev/ca2cee13-dce4-42ea-8fb9-2b5c115b07dc?feed_type=dzen" 
                  className="hover:text-accent transition-colors uppercase tracking-wider" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  RSS ДЗЕН
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-white/20 my-12"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/50 font-bold uppercase tracking-wider">
          <p>© 2025 ГОРОД ГОВОРИТ: КРАСНОДАР. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-accent transition-colors">
              КОНФИДЕНЦИАЛЬНОСТЬ
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              ПРАВИЛА
            </a>
          </div>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
    (function (w, d, c) {
    (w[c] = w[c] || []).push(function() {
        var options = {
            project: 7749614,
        };
        try {
            w.top100Counter = new top100(options);
        } catch(e) { }
    });
    var n = d.getElementsByTagName("script")[0],
    s = d.createElement("script"),
    f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src =
    (d.location.protocol == "https:" ? "https:" : "http:") +
    "//st.top100.ru/top100/top100.js";

    if (w.opera == "[object Opera]") {
    d.addEventListener("DOMContentLoaded", f, false);
} else { f(); }
})(window, document, "_top100q");
          `,
        }}
      />
      <noscript>
        <img src="//counter.rambler.ru/top100.cnt?pid=7749614" alt="Топ-100" />
      </noscript>
    </footer>
  );
};