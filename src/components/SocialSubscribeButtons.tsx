import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SocialSubscribeButtonsProps {
  size?: 'default' | 'compact';
  className?: string;
}

export const SocialSubscribeButtons = ({ size = 'default', className = '' }: SocialSubscribeButtonsProps) => {
  const isCompact = size === 'compact';
  
  const socials = [
    {
      name: 'Telegram',
      icon: 'Send',
      url: 'https://t.me/govoritkrasnodarn',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      name: 'ВКонтакте',
      icon: 'Share2',
      url: 'https://vk.com/public227848903',
      gradient: 'from-blue-600 to-blue-700',
      hoverGradient: 'hover:from-blue-700 hover:to-blue-800',
    },
    {
      name: 'Дзен',
      icon: 'Zap',
      url: 'https://dzen.ru/id/6791ddee3fc76a53d2aaba4b',
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
    },
  ];

  if (isCompact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs md:text-sm font-medium text-muted-foreground whitespace-nowrap">
          Подписывайтесь:
        </span>
        <div className="flex gap-1.5">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-1 px-2 py-1.5 md:px-3 md:py-2 bg-gradient-to-r ${social.gradient} ${social.hoverGradient} text-white text-xs font-semibold rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105`}
            >
              <Icon name={social.icon as any} size={14} className="flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-8 md:py-12 ${className}`}>
      <h3 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Подписывайтесь на наши каналы!
      </h3>
      <p className="text-muted-foreground mb-6 text-sm md:text-base">
        Будьте в курсе всех новостей Краснодара
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${social.gradient} ${social.hoverGradient} text-white font-bold rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105 w-full sm:w-auto`}
          >
            <Icon name={social.icon as any} size={20} />
            <span>{social.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};