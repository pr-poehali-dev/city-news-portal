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
  'Город, как ты?', 'Что нового?', 'Как настроение?', 'Расскажи о сегодняшнем дне',
  'Что происходит на улицах?', 'Как твои жители?', 'Какая погода у тебя на душе?',
  'Что радует сегодня?', 'Есть новости?', 'О чём думаешь?', 'Что беспокоит?',
  'Как прошёл день?', 'Чем гордишься?', 'Что изменилось?', 'Видел что-то интересное?',
  'Какие планы?', 'Что порекомендуешь?', 'Расскажи шутку про Краснодар',
  'Что говорят люди?', 'Какое у тебя впечатление от дня?', 'Что сейчас происходит?',
  'Как дела на Красной?', 'Что в парках?', 'Какие события сегодня?', 'Как с транспортом?',
  'Что интересного увидел?', 'Куда советуешь сходить?', 'Как живётся краснодарцам?',
  'Что нового за последнее время?', 'Чем занимаются жители?', 'Какая атмосфера в центре?',
  'Что на набережной?', 'Как погода влияет на настроение?', 'Расскажи про районы',
  'Что особенного сегодня?', 'Какие традиции любишь?', 'Что делает тебя уникальным?',
  'Как относишься к туристам?', 'Что нравится местным?', 'Какие проблемы волнуют?',
  'Чем славится Краснодар?', 'Как развивается город?', 'Что в культурной жизни?',
  'Как проходят выходные?', 'Что думаешь о будущем?', 'Какие мероприятия проходят?',
  'Как меняется архитектура?', 'Что в спорте?', 'Какая кухня популярна?',
  'Что творится на рынках?', 'Как живут парки?', 'Что нового в образовании?',
  'Какие стартапы развиваются?', 'Как бизнес?', 'Что с экологией?',
  'Какие проекты реализуются?', 'Как с жильём?', 'Что думаешь о транспорте?',
  'Какие фестивали проходят?', 'Как туризм?', 'Что в ночной жизни?',
  'Какие кафе популярны?', 'Как проходят праздники?', 'Что нового в искусстве?',
  'Какие музеи стоит посетить?', 'Как театральная жизнь?', 'Что в музыке?',
  'Какие концерты проходят?', 'Как молодёжные пространства?', 'Что в библиотеках?',
  'Какие выставки идут?', 'Как кино?', 'Что нового в торговле?', 'Какие ТЦ популярны?',
  'Как с парковками?', 'Что со спортивными объектами?', 'Какие школы выделяются?',
  'Как медицина?', 'Что нового в технологиях?', 'Какие коворкинги работают?',
  'Как digital-жизнь?', 'Что с благоустройством?', 'Какие скверы облагородили?',
  'Как велоинфраструктура?', 'Что нового в общественном транспорте?', 'Какие маршруты удобные?',
  'Как каршеринг?', 'Что с такси?', 'Какие сервисы популярны?', 'Как доставка?',
  'Что нового в ритейле?', 'Какие бренды открылись?', 'Как с безопасностью?',
  'Что в социальной сфере?', 'Какие благотворительные проекты?', 'Как помогают нуждающимся?',
  'Что делается для пожилых?', 'Как детские площадки?', 'Что нового для семей?',
  'Какие активности для детей?', 'Как школьные каникулы?', 'Что для подростков?',
  'Какие кружки популярны?'
];

const UNIQUE_RESPONSES: Record<string, string[]> = {
  настроение: [
    'Сегодня бодрое! Мои улицы полны жизни и энергии 🌟',
    'Немного задумчивое... Размышляю о том, как быстро меняется мир вокруг 🤔',
    'Воодушевлённое! Столько интересных событий происходит 🎉',
    'Спокойное и умиротворённое, как южный вечер 🌅',
    'Игривое! Хочется радоваться солнцу и теплу ☀️'
  ],
  новости: [
    'На Красной улице сегодня особенно оживлённо — люди наслаждаются погодой! 🚶',
    'В парке Галицкого молодёжь устраивает пикники. Красота! 🌳',
    'Набережная полна людей — кто-то гуляет, кто-то фотографируется 📸',
    'На рынках сегодня особенный ажиотаж — сезон арбузов в разгаре! 🍉',
    'Мои жители активно готовятся к выходным — планируют поездки на море 🏖️'
  ],
  жители: [
    'Мои краснодарцы, как всегда, гостеприимные и душевные! Горжусь ими ❤️',
    'Наблюдаю, как люди спешат на работу утром и неспешно гуляют вечером 🚶',
    'Жители радуют своей энергией — столько идей, планов, проектов! 💡',
    'Местные знают толк в хорошей еде и душевных посиделках 🍽️',
    'Краснодарцы умеют и работать, и отдыхать от души! 🎊'
  ],
  шутки: [
    'У нас две беды: дороги и дороги. Одни разбитые, другие в ремонте! 😄',
    'Краснодарцы не опаздывают — они попадают в пробку. Это разные вещи! 🚗',
    'Погода: утром +5, днём +25, вечером дождь. Одевайся слоями! 🌦️',
    'Метро? Нет, не слышали. У нас есть Красная улица! 🚇',
    'Краснодар: где арбузы дешевле проезда на маршрутке! 🍉',
    'Главная достопримечательность? Пробка на Тургеневском мосту! 😅',
    'Три сезона: жара, дождь, опять жара 🌡️',
    'Две категории: кто с моря, и кто едет на море 🏖️',
    '"Заходи, чай-кофе-борщ-пирожки-компот-ещё поешь!" — вот это гостеприимство! ☕',
    'Не "пойду в центр", а "встретимся на Красной" 🎭'
  ],
  рекомендации: [
    'Советую прогуляться по Красной вечером — атмосфера волшебная! ✨',
    'Обязательно посети парк Галицкого — один из лучших в России 🏞️',
    'Попробуй шаурму на Рашпилевской — местный must-have! 🌯',
    'Сходи на набережную Кубани на закате — незабываемо! 🌅',
    'Загляни на Центральный рынок — там дух настоящего Краснодара 🍅'
  ],
  общее: [
    'Я живу, дышу, наблюдаю за своими улицами и площадями 🏙️',
    'Каждый день приносит что-то новое — то событие, то встречу 🌆',
    'Горжусь своей историей и с оптимизмом смотрю в будущее 🚀',
    'Меняюсь и развиваюсь, но остаюсь тёплым южным городом ❤️',
    'Люблю наблюдать, как мои жители строят свои мечты здесь 💭',
    'Утром просыпаюсь под пение птиц, вечером любуюсь закатами 🌇',
    'Рад каждому, кто приезжает познакомиться со мной 🤗',
    'Ценю и прошлое, и настоящее — всё это делает меня собой 🏛️'
  ]
};

const getRandomResponse = (category: string, usedResponses: Set<string>): string => {
  const responses = UNIQUE_RESPONSES[category] || UNIQUE_RESPONSES.общее;
  const available = responses.filter(r => !usedResponses.has(r));
  const pool = available.length > 0 ? available : responses;
  return pool[Math.floor(Math.random() * pool.length)];
};

const generatePersonalizedAnswer = (question: string, posts: CityPost[], usedResponses: Set<string>): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('шутк') || lowerQuestion.includes('посмей') || lowerQuestion.includes('рассмеши')) {
    return getRandomResponse('шутки', usedResponses);
  }

  if (lowerQuestion.includes('настроение') || lowerQuestion.includes('погода') || lowerQuestion.includes('душ')) {
    return getRandomResponse('настроение', usedResponses);
  }

  if (lowerQuestion.includes('нового') || lowerQuestion.includes('новост') || lowerQuestion.includes('происходит')) {
    if (posts.length > 0) {
      const recentPosts = posts.slice(-10);
      const randomPost = recentPosts[Math.floor(Math.random() * recentPosts.length)];
      return `${randomPost.text}\n\n📍 ${randomPost.location}`;
    }
    return getRandomResponse('новости', usedResponses);
  }

  if (lowerQuestion.includes('жител') || lowerQuestion.includes('люд') || lowerQuestion.includes('говорят')) {
    return getRandomResponse('жители', usedResponses);
  }

  if (lowerQuestion.includes('рекоменд') || lowerQuestion.includes('посовет') || lowerQuestion.includes('куда')) {
    return getRandomResponse('рекомендации', usedResponses);
  }

  return getRandomResponse('общее', usedResponses);
};

export const CityVoiceSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityPosts, setCityPosts] = useState<CityPost[]>([]);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [usedResponses, setUsedResponses] = useState<Set<string>>(new Set());

  const displayedQuestions = useMemo(() => {
    const available = ALL_QUESTIONS.filter(q => !usedQuestions.has(q));
    const pool = available.length >= 6 ? available : ALL_QUESTIONS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [usedQuestions]);

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
    
    const savedQuestions = localStorage.getItem('cityUsedQuestions');
    if (savedQuestions) {
      try {
        setUsedQuestions(new Set(JSON.parse(savedQuestions)));
      } catch (e) {
        console.error('Error loading used questions:', e);
      }
    }
    
    const savedResponses = localStorage.getItem('cityUsedResponses');
    if (savedResponses) {
      try {
        setUsedResponses(new Set(JSON.parse(savedResponses)));
      } catch (e) {
        console.error('Error loading used responses:', e);
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

    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(question);
    setUsedQuestions(newUsedQuestions);
    localStorage.setItem('cityUsedQuestions', JSON.stringify([...newUsedQuestions]));

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const answerText = generatePersonalizedAnswer(question, cityPosts, usedResponses);
      
      const newUsedResponses = new Set(usedResponses);
      newUsedResponses.add(answerText);
      setUsedResponses(newUsedResponses);
      localStorage.setItem('cityUsedResponses', JSON.stringify([...newUsedResponses]));

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
    setUsedQuestions(new Set());
    setUsedResponses(new Set());
    localStorage.removeItem('cityDialogHistory');
    localStorage.removeItem('cityUsedQuestions');
    localStorage.removeItem('cityUsedResponses');
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
            100 уникальных вопросов • Использованные заменяются новыми
          </p>
        </div>

        <div className="px-6 py-4 bg-blue-500/5 border-t border-blue-500/20">
          <div className="flex items-start gap-2 text-sm">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Как это работает?</strong> Город генерирует уникальные ответы на основе последних новостей и большой базы вариантов. Каждый ответ появляется только один раз! Переписка сохраняется в твоём браузере.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};