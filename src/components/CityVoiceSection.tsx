import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  type: 'user' | 'city';
  text: string;
  timestamp: Date;
}

const FUNCTION_URL = 'https://functions.poehali.dev/d7440490-2756-4be6-9013-fc14e99c0a76';

const QUESTIONS = [
  'Город, как ты?',
  'Что нового?',
  'Как настроение?',
  'Расскажи о сегодняшнем дне',
  'Что происходит на улицах?',
  'Как твои жители?'
];

export const CityVoiceSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasInitialPost, setHasInitialPost] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cityDialogHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        setHasInitialPost(true);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    } else {
      loadInitialPost();
    }
  }, []);

  const loadInitialPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(FUNCTION_URL);
      if (response.ok) {
        const data = await response.json();
        const posts = Array.isArray(data) ? data : [];
        if (posts.length > 0) {
          const latestPost = posts[posts.length - 1];
          const initialMessage: Message = {
            id: Date.now().toString(),
            type: 'city',
            text: latestPost.text,
            timestamp: new Date()
          };
          setMessages([initialMessage]);
          setHasInitialPost(true);
        }
      }
    } catch (error) {
      console.error('Error loading initial post:', error);
    } finally {
      setLoading(false);
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

    try {
      const response = await fetch(FUNCTION_URL);
      if (response.ok) {
        const data = await response.json();
        const posts = Array.isArray(data) ? data : [];
        
        let answerText = 'Спасибо за вопрос! Сегодня прекрасный день 😊';
        
        if (posts.length > 0) {
          const randomPost = posts[Math.floor(Math.random() * posts.length)];
          answerText = randomPost.text;
        }

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
      }
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    setHasInitialPost(false);
    localStorage.removeItem('cityDialogHistory');
    loadInitialPost();
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
                <p className="text-sm leading-relaxed">{message.text}</p>
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
            {QUESTIONS.map((question, index) => (
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
        </div>

        <div className="px-6 py-4 bg-blue-500/5 border-t border-blue-500/20">
          <div className="flex items-start gap-2 text-sm">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <strong className="text-foreground">Как это работает?</strong> Город отвечает на основе сегодняшних новостей и настроения. AI генерирует уникальные ответы 3 раза в день. Твоя переписка сохраняется только у тебя в браузере.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
