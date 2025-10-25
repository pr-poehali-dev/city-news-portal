import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const CITY_CHAT_URL = 'https://functions.poehali.dev/51ec73b8-6596-41e0-8724-009e5478d445';

export const CityChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const askedQuestions = useRef<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: 'Здравствуйте! Я AI-ассистент городского портала Краснодара. Задайте мне вопрос о новостях, местах или событиях города.',
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const quickQuestions = [
    'Какие новости сегодня?',
    'Куда сходить в Краснодаре?',
    'Интересные места города',
    'Погода в Краснодаре',
    'События на выходные'
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const normalizedQuestion = input.trim().toLowerCase();
    
    if (askedQuestions.current.has(normalizedQuestion)) {
      const warningMsg: Message = {
        id: Date.now().toString(),
        text: 'Вы уже задавали этот вопрос. Попробуйте спросить что-то другое!',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, warningMsg]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    askedQuestions.current.add(normalizedQuestion);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(CITY_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Извините, не удалось получить ответ.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Произошла ошибка. Попробуйте позже.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center"
        size="icon"
      >
        <Icon name="MessageCircle" size={24} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[550px] shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Icon name="Bot" size={20} />
          <h3 className="font-semibold">AI-ассистент</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t space-y-3">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Задайте вопрос..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
};