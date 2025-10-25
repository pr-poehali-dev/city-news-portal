import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface CityPost {
  id: number;
  text: string;
  mood: string;
  location: string;
  timestamp: string;
  timeOfDay: string;
  author: string;
  type: string;
}

const FUNCTION_URL = 'https://functions.poehali.dev/d7440490-2756-4be6-9013-fc14e99c0a76';

export const CityVoiceSection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(FUNCTION_URL);
      if (response.ok) {
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading city posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeIcon = (timeOfDay: string) => {
    const icons: Record<string, string> = {
      'утро': 'Sunrise',
      'день': 'Sun',
      'вечер': 'Sunset'
    };
    return icons[timeOfDay] || 'Clock';
  };

  const getTimeColor = (timeOfDay: string) => {
    const colors: Record<string, string> = {
      'утро': 'text-orange-500',
      'день': 'text-yellow-500',
      'вечер': 'text-purple-500'
    };
    return colors[timeOfDay] || 'text-blue-500';
  };

  if (loading) {
    return null;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Icon name="MessageCircle" className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Город говорит</h2>
            <p className="text-sm text-muted-foreground">
              AI-заметки от имени Краснодара • Генерируется 3 раза в день
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/city-talks')}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Все заметки
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30 group"
            onClick={() => navigate('/city-talks')}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-full bg-primary/10 ${getTimeColor(post.timeOfDay)}`}>
                <Icon name={getTimeIcon(post.timeOfDay)} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm capitalize">{post.timeOfDay}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    AI
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(post.timestamp).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <p className="text-base leading-relaxed mb-3 group-hover:text-primary transition-colors">
              {post.text}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="MapPin" size={12} />
                {post.location}
              </span>
              <span className="capitalize text-primary/70">{post.mood}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-dashed border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" className="text-primary mt-0.5" size={20} />
          <div className="flex-1 text-sm">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Как это работает?</strong> Искусственный интеллект анализирует новости за день и пишет короткие заметки от имени города Краснодар. Заметки генерируются автоматически утром, днем и вечером.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
