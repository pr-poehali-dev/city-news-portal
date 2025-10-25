import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface NotificationSubscribeProps {
  compact?: boolean;
}

export const NotificationSubscribe = ({ compact = false }: NotificationSubscribeProps) => {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const subscribed = localStorage.getItem('notifications-subscribed') === 'true';
      setIsSubscribed(subscribed);
    }

    const promoDismissed = localStorage.getItem('notification-promo-dismissed');
    const promoShownAt = localStorage.getItem('notification-promo-shown-at');
    
    if (!promoDismissed && !promoShownAt) {
      const timer = setTimeout(() => {
        if (Notification.permission === 'default') {
          setShowPromo(true);
          localStorage.setItem('notification-promo-shown-at', Date.now().toString());
        }
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Уведомления не поддерживаются',
        description: 'Ваш браузер не поддерживает push-уведомления',
        variant: 'destructive'
      });
      return;
    }

    if (permission === 'denied') {
      toast({
        title: 'Уведомления заблокированы',
        description: 'Разрешите уведомления в настройках браузера',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        localStorage.setItem('notifications-subscribed', 'true');
        localStorage.setItem('notification-subscription-time', Date.now().toString());
        setIsSubscribed(true);
        setShowPromo(false);
        
        toast({
          title: 'Вы подписаны!',
          description: 'Теперь вы будете получать уведомления о новостях с 10:00 до 20:00'
        });

        new Notification('Город говорит', {
          body: 'Вы успешно подписались на уведомления',
          icon: '/icon-192.png',
          badge: '/icon-192.png'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подписаться на уведомления',
        variant: 'destructive'
      });
    }
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem('notifications-subscribed');
    localStorage.removeItem('notification-subscription-time');
    setIsSubscribed(false);
    
    toast({
      title: 'Вы отписались',
      description: 'Уведомления больше не будут приходить'
    });
  };

  const handleDismissPromo = () => {
    setShowPromo(false);
    localStorage.setItem('notification-promo-dismissed', 'true');
  };

  if (compact) {
    return (
      <>
        <Button
          variant={isSubscribed ? "default" : "outline"}
          size="sm"
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          className="gap-2"
        >
          <Icon name={isSubscribed ? "BellOff" : "Bell"} size={16} />
          <span className="hidden md:inline">
            {isSubscribed ? 'Отписаться' : 'Подписаться'}
          </span>
        </Button>

        <Dialog open={showPromo} onOpenChange={setShowPromo}>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="Bell" size={24} className="text-primary" />
                Подпишитесь на новости
              </DialogTitle>
              <DialogDescription className="space-y-3 pt-2">
                <p>
                  Получайте уведомления о новых публикациях:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Icon name="Newspaper" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                    <span>Свежие новости Краснодара</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Landmark" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                    <span>Новые места и заведения</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="BookOpen" size={16} className="mt-0.5 text-primary flex-shrink-0" />
                    <span>Исторические статьи</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground border-t pt-3">
                  Уведомления приходят с 10:00 до 20:00, не чаще 1 раза в час
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubscribe} className="flex-1">
                <Icon name="Bell" size={16} className="mr-2" />
                Подписаться
              </Button>
              <Button variant="ghost" onClick={handleDismissPromo}>
                Позже
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
};
