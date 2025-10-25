import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CityPost {
  id: number;
  text: string;
  mood: string;
  location: string;
  timestamp: string;
  author: string;
  type: string;
}

const CityTalks = () => {
  const [posts, setPosts] = useState<CityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState<CityPost | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/d7440490-2756-4be6-9013-fc14e99c0a76');
      if (response.ok) {
        const data = await response.json();
        setCurrentPost(data);
        setPosts(prev => [data, ...prev].slice(0, 20));
      }
    } catch (error) {
      console.error('Error fetching city post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const getMoodIcon = (mood: string) => {
    const moodIcons: Record<string, string> = {
      playful: 'Smile',
      appreciative: 'Sparkles',
      warm: 'Heart',
      caring: 'Shield',
      proud: 'Award',
      philosophical: 'BookOpen',
      cheerful: 'Sun',
      romantic: 'Moon',
      lively: 'Zap',
      refreshed: 'CloudRain',
      grateful: 'Gift',
      supportive: 'ThumbsUp',
      peaceful: 'Leaf',
      inspired: 'Star',
      excited: 'PartyPopper'
    };
    return moodIcons[mood] || 'MessageCircle';
  };

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      playful: 'text-yellow-600',
      appreciative: 'text-purple-600',
      warm: 'text-red-500',
      caring: 'text-blue-600',
      proud: 'text-amber-600',
      philosophical: 'text-indigo-600',
      cheerful: 'text-orange-500',
      romantic: 'text-pink-600',
      lively: 'text-green-600',
      refreshed: 'text-cyan-600',
      grateful: 'text-rose-600',
      supportive: 'text-lime-600',
      peaceful: 'text-emerald-600',
      inspired: 'text-violet-600',
      excited: 'text-fuchsia-600'
    };
    return moodColors[mood] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <SiteHeader sections={[]} activeSection="" onSectionChange={() => {}} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Icon name="MessageCircle" className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Город говорит
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Краснодар делится своими мыслями, наблюдениями и настроением от первого лица
          </p>
        </div>

        <div className="mb-8 text-center">
          <Button 
            onClick={fetchPost} 
            disabled={loading}
            size="lg"
            className="gap-2"
          >
            <Icon name="RefreshCw" className={loading ? 'animate-spin' : ''} />
            {loading ? 'Слушаю город...' : 'Что говорит город?'}
          </Button>
        </div>

        {currentPost && (
          <Card className="p-8 mb-8 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-primary/10 ${getMoodColor(currentPost.mood)}`}>
                <Icon name={getMoodIcon(currentPost.mood)} size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg">{currentPost.author}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{currentPost.location}</span>
                </div>
                <p className="text-lg leading-relaxed mb-4">{currentPost.text}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={16} />
                    {new Date(currentPost.timestamp).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium capitalize">
                    {currentPost.mood}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {posts.length > 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Icon name="History" />
              Предыдущие высказывания
            </h2>
            {posts.slice(1).map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-muted ${getMoodColor(post.mood)}`}>
                    <Icon name={getMoodIcon(post.mood)} size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.location}</span>
                    </div>
                    <p className="mb-2">{post.text}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.timestamp).toLocaleString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Нажмите кнопку, чтобы услышать голос города</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CityTalks;