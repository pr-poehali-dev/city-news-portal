import { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  type: 'user' | 'city';
  text: string;
  timestamp: Date;
}

interface CityPost {
  id: number;
  text: string;
  mood: string;
  location: string;
  timestamp: string;
  author: string;
  type: string;
}

const FUNCTION_URL = 'https://functions.poehali.dev/d7440490-2756-4be6-9013-fc14e99c0a76';

const ALL_QUESTIONS = [
  'Город, как ты?',
  'Что нового?',
  'Как настроение?',
  'Расскажи о сегодняшнем дне',
  'Что происходит на улицах?',
  'Как твои жители?',
  'Какая погода у тебя на душе?',
  'Что радует сегодня?',
  'Есть новости?',
  'О чём думаешь?',
  'Что беспокоит?',
  'Как прошёл день?',
  'Чем гордишься?',
  'Что изменилось?',
  'Видел что-то интересное?',
  'Какие планы?',
  'Что порекомендуешь?',
  'Расскажи шутку про Краснодар',
  'Что говорят люди?',
  'Какое у тебя впечатление от дня?'
];

const KRASNODAR_JOKES = [
  'У нас две беды: дороги и дороги. Одни разбитые, другие — в вечном ремонте! 😄',
  'Краснодарцы не опаздывают — они попадают в пробку на Красной. Это разные вещи! 🚗',
  'Погода в Краснодаре: утром +5, днём +25, вечером дождь. Одевайся слоями, как капуста! 🌦️',
  'Говорят, в других городах есть метро. Мы про это только в байках слышали 🚇',
  'Краснодар: где арбузы дешевле, чем проезд на маршрутке! 🍉',
  'Главная достопримечательность города? Правильно, пробка на мосту! 😅',
  'В Краснодаре три сезона: жара, дождь и снова жара 🌡️',
  'Местные делятся на две категории: кто с моря, и кто едет на море 🏖️',
  'Краснодарское гостеприимство: "Заходи, чай-кофе-борщ-пирожки-компот-ещё-что-то!" ☕',
  'У нас не говорят "пойду в центр", говорят "встретимся на Красной" 🎭'
];

const generatePersonalizedAnswer = (question: string, posts: CityPost[]): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('шутк') || lowerQuestion.includes('посмей') || lowerQuestion.includes('рассмеши')) {
    return KRASNODAR_JOKES[Math.floor(Math.random() * KRASNODAR_JOKES.length)];
  }

  if (posts.length === 0) {
    return 'Сегодня спокойный день, наслаждаюсь тишиной и солнцем ☀️';
  }

  const recentPosts = posts.slice(-10);
  
  if (lowerQuestion.includes('настроение') || lowerQuestion.includes('погода') || lowerQuestion.includes('душ')) {
    const moods = recentPosts.map(p => p.mood);
    const moodCount: Record<string, number> = {};
    moods.forEach(m => moodCount[m] = (moodCount[m] || 0) + 1);
    const dominantMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    
    const moodResponses: Record<string, string> = {
      playful: 'Игривое! Хочется веселиться и радоваться жизни 😊',
      appreciative: 'Благодарное! Ценю каждый момент сегодняшнего дня ✨',
      warm: 'Тёплое и уютное, как домашний плед 🤗',
      caring: 'Забочусь о своих жителях, как всегда ❤️',
      proud: 'Горжусь тем, что происходит на моих улицах! 🏆',
      cheerful: 'Бодрое и солнечное! Отличный день ☀️',
      peaceful: 'Спокойное и умиротворённое 🍃',
      excited: 'Воодушевлённое! Столько всего интересного 🎉'
    };
    
    return moodResponses[dominantMood] || 'Настроение отличное! Живу и радуюсь 😊';
  }

  if (lowerQuestion.includes('нового') || lowerQuestion.includes('новост') || lowerQuestion.includes('происходит')) {
    const randomPost = recentPosts[Math.floor(Math.random() * recentPosts.length)];
    return `${randomPost.text}\n\n📍 ${randomPost.location}`;
  }

  if (lowerQuestion.includes('жител') || lowerQuestion.includes('люд') || lowerQuestion.includes('говорят')) {
    return `Мои жители, как всегда, в движении! Кто-то спешит на работу, кто-то гуляет в парках, кто-то строит планы. Люблю наблюдать за этой суетой 🚶‍♂️`;
  }

  if (lowerQuestion.includes('день') || lowerQuestion.includes('прошёл') || lowerQuestion.includes('как ты')) {
    const latestPost = recentPosts[recentPosts.length - 1];
    return latestPost ? latestPost.text : 'День как день — живу, дышу, наблюдаю за своими улицами 🌆';
  }

  if (lowerQuestion.includes('горд') || lowerQuestion.includes('радует')) {
    return `Горжусь своими жителями — трудолюбивыми, гостеприимными, весёлыми! И, конечно, своей природой: морем рядом, горами на горизонте 🏔️`;
  }

  if (lowerQuestion.includes('измени') || lowerQuestion.includes('стало')) {
    return `Меняюсь каждый день: новые дома, новые лица, новые истории. Но суть остаётся — я южный, тёплый, душевный город ❤️`;
  }

  if (lowerQuestion.includes('план') || lowerQuestion.includes('будущ')) {
    return `Планирую продолжать расти, развиваться и радовать своих жителей! А ещё хочу меньше пробок 😄`;
  }

  if (lowerQuestion.includes('рекоменд') || lowerQuestion.includes('посовет')) {
    return `Рекомендую прогуляться по Красной улице вечером, посидеть в парке Галицкого, а потом съесть шаурму на Рашпилевской. Вот это настоящий Краснодар! 🌆`;
  }

  const randomPost = recentPosts[Math.floor(Math.random() * recentPosts.length)];
  return randomPost ? randomPost.text : 'Спасибо за вопрос! Сегодня обычный день в жизни города 😊';
};

export const CityVoiceSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityPosts, setCityPosts] = useState<CityPost[]>([]);

  const displayedQuestions = useMemo(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('cityDialogHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
    loadCityPosts();
  }, []);

  const loadCityPosts = async () => {
    try {
      const response = await fetch(FUNCTION_URL);
      if (response.ok) {
        const data = await response.json();
        const posts = Array.isArray(data) ? data : [data];
        setCityPosts(posts);
        
        if (messages.length === 0 && posts.length > 0) {
          const latestPost = posts[posts.length - 1];
          const initialMessage: Message = {
            id: Date.now().toString(),
            type: 'city',
            text: latestPost.text,
            timestamp: new Date()
          };
          setMessages([initialMessage]);
          localStorage.setItem('cityDialogHistory', JSON.stringify([initialMessage]));
        }
      }
    } catch (error) {
      console.error('Error loading city posts:', error);
    }
  };

  const askQuestion = async (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const answerText = generatePersonalizedAnswer(question, cityPosts);

      const cityMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'city',
        text: answerText,
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev, cityMessage];
        localStorage.setItem('cityDialogHistory', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('cityDialogHistory');
    loadCityPosts();
  };

  return (
    <div className="my-12">
      <Card className="overflow-hidden border-2">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Icon name="MessageCircle" className="text-primary" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Поговори с городом</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  AI отвечает от имени Краснодара
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="gap-2"
              >
                <Icon name="RotateCcw" size={16} />
                Очистить
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 && !loading && (
            <div className="text-center py-12">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">Начни диалог с городом</p>
              <p className="text-sm text-muted-foreground">Выбери вопрос ниже</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'city' && (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Building2" className="text-primary" size={20} />
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {message.type === 'user' && (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={20} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Building2" className="text-primary" size={20} />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex flex-wrap gap-2">
            {displayedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => askQuestion(question)}
                disabled={loading}
                className="rounded-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Icon name="Send" size={14} />
                {question}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Вопросы обновляются при перезагрузке страницы
          </p>
        </div>

        <div className="px-6 py-4 bg-blue-500/5 border-t border-blue-500/20">
          <div className="flex items-start gap-2 text-sm">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Как это работает?</strong> Город отвечает на основе последних новостей и локального юмора Краснодара. Ответы персонализированы под каждый вопрос. Твоя переписка сохраняется только у тебя в браузере.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
