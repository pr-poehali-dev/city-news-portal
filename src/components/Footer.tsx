import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface FooterProps {
  sections?: string[];
  onSectionChange?: (section: string) => void;
}

export const Footer = ({ sections = [], onSectionChange }: FooterProps) => {
  return (
    <footer className="bg-secondary border-t-4 border-primary mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-4xl font-black mb-2 tracking-tight">
              ГОРОД<br/>
              <span className="text-accent">ГОВОРИТ</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider font-black">
              Краснодар
            </p>
            <div className="flex gap-3">
              <a href="https://vk.com/club233389110" target="_blank" rel="noopener noreferrer" 
                className="w-12 h-12 bg-primary text-primary-foreground hover:bg-accent flex items-center justify-center transition-colors" 
                title="ВКонтакте">
                <Icon name="Users" size={22} />
              </a>
              <a href="https://dzen.ru/govoritkrasnodar" target="_blank" rel="noopener noreferrer" 
                className="w-12 h-12 bg-primary text-primary-foreground hover:bg-accent flex items-center justify-center transition-colors" 
                title="Яндекс Дзен">
                <Icon name="BookOpen" size={22} />
              </a>
            </div>
          </div>

          {sections.length > 0 && (
            <div>
              <h4 className="font-black text-foreground mb-6 uppercase text-sm tracking-widest">РАЗДЕЛЫ</h4>
              <ul className="space-y-3 text-sm">
                {sections.slice(0, 6).map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => onSectionChange?.(section)}
                      className="text-muted-foreground hover:text-primary transition-colors font-black uppercase tracking-wider hover:underline"
                    >
                      {section}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-black text-foreground mb-6 uppercase text-sm tracking-wider">Социальные сети</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://vk.com/club233389110" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all flex items-center gap-2 font-medium group">
                  <Icon name="Users" size={16} className="group-hover:scale-110 transition-transform" />
                  ВКонтакте
                </a>
              </li>
              <li>
                <a href="https://dzen.ru/govoritkrasnodar" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Icon name="BookOpen" size={16} />
                  Яндекс Дзен
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                moskv.nickita@yandex.ru
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                +7 (911) 126-96-39
              </li>
              <li className="flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                Краснодар, ул. Красная, 1
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Rss" size={16} />
                <a href="https://functions.poehali.dev/ca2cee13-dce4-42ea-8fb9-2b5c115b07dc?feed_type=news" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  RSS Новости
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Rss" size={16} />
                <a href="https://functions.poehali.dev/ca2cee13-dce4-42ea-8fb9-2b5c115b07dc?feed_type=dzen" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                  RSS Дзен
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025 Город говорит: Краснодар. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Правила использования
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