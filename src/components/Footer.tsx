import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface FooterProps {
  sections: string[];
  onSectionChange: (section: string) => void;
}

export const Footer = ({ sections, onSectionChange }: FooterProps) => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-primary mb-4">
              Город говорит
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ваш источник актуальных новостей и событий Краснодара
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Facebook" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Разделы</h4>
            <ul className="space-y-2 text-sm">
              {sections.slice(0, 6).map((section) => (
                <li key={section}>
                  <button
                    onClick={() => onSectionChange(section)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Социальные сети</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Icon name="Users" size={16} />
                  ВКонтакте
                </a>
              </li>
              <li>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Icon name="Send" size={16} />
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://ok.ru" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  Одноклассники
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
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
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
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
    </footer>
  );
};