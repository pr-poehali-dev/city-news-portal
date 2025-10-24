import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

interface NewsArticle {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  comments: Comment[];
}

const Index = () => {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: 1,
      title: 'Новый культурный центр откроется в центре города',
      category: 'Культура',
      excerpt: 'В историческом районе появится современное пространство для искусства и творчества',
      image: 'https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/f78213ac-5101-438a-b303-5acde2b94047.jpg',
      date: '24 октября 2025',
      readTime: '5 мин',
      comments: []
    },
    {
      id: 2,
      title: 'Городской бюджет: основные направления расходов',
      category: 'Экономика',
      excerpt: 'Мэрия представила план финансирования социальных программ на следующий год',
      image: 'https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/56d8656d-d8a1-43bf-be7e-9be948eebfb4.jpg',
      date: '24 октября 2025',
      readTime: '7 мин',
      comments: []
    },
    {
      id: 3,
      title: 'Местная команда вышла в финал регионального чемпионата',
      category: 'Спорт',
      excerpt: 'Решающий матч состоится в эту субботу на городском стадионе',
      image: 'https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/b37eb08f-dad0-4072-b740-9882b5ddc15c.jpg',
      date: '23 октября 2025',
      readTime: '4 мин',
      comments: []
    }
  ]);

  const [activeSection, setActiveSection] = useState('Главная');

  const sections = [
    'Главная',
    'Новости',
    'Политика',
    'Экономика',
    'Культура',
    'Спорт',
    'События',
    'О портале',
    'Контакты'
  ];

  const handleAddComment = (articleId: number) => {
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: commentName,
      text: commentText,
      time: 'Только что'
    };

    setArticles(articles.map(article => 
      article.id === articleId 
        ? { ...article, comments: [...article.comments, newComment] }
        : article
    ));

    setCommentName('');
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-primary font-serif">
              ГородNews
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Icon name="Search" size={20} />
              </Button>
              <Button variant="outline" size="sm">
                Подписаться
              </Button>
            </div>
          </div>
          
          <nav className="flex gap-6 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === section
                    ? 'text-primary border-b-2 border-primary pb-2'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {articles.map((article, index) => (
            <Card 
              key={article.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer animate-fade-in ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`grid ${index === 0 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-0`}>
                <div className="relative overflow-hidden group">
                  <img
                    src={article.image}
                    alt={article.title}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      index === 0 ? 'h-full min-h-[400px]' : 'h-64'
                    }`}
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-white">
                    {article.category}
                  </Badge>
                </div>

                <CardContent className="p-6 flex flex-col justify-between">
                  <div>
                    <h2 className={`font-serif font-bold mb-3 hover:text-primary transition-colors ${
                      index === 0 ? 'text-3xl' : 'text-2xl'
                    }`}>
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={16} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MessageSquare" size={16} />
                        {article.comments.length}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={() => setSelectedArticle(selectedArticle === article.id ? null : article.id)}
                      >
                        {selectedArticle === article.id ? 'Скрыть' : 'Читать и обсудить'}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Icon name="Share2" size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>

              {selectedArticle === article.id && (
                <div className="border-t bg-muted/30 animate-accordion-down">
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold mb-4">
                      Комментарии ({article.comments.length})
                    </h3>

                    <div className="space-y-4 mb-6">
                      {article.comments.map((comment) => (
                        <div key={comment.id} className="bg-white p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon name="User" size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{comment.author}</p>
                              <p className="text-xs text-muted-foreground">{comment.time}</p>
                            </div>
                          </div>
                          <p className="text-sm ml-10">{comment.text}</p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <h4 className="font-semibold">Оставить комментарий</h4>
                      <Input
                        placeholder="Ваше имя"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                      />
                      <Textarea
                        placeholder="Ваш комментарий..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        onClick={() => handleAddComment(article.id)}
                        className="w-full"
                      >
                        Отправить комментарий
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-foreground text-background py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">ГородNews</h3>
              <p className="text-sm opacity-80">
                Актуальные новости вашего города. Будьте в курсе событий вместе с нами.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Новости</li>
                <li>Политика</li>
                <li>Экономика</li>
                <li>Культура</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Email: info@gorodnews.ru</li>
                <li>Телефон: +7 (XXX) XXX-XX-XX</li>
                <li>Адрес: ул. Примерная, 1</li>
              </ul>
            </div>
          </div>
          <Separator className="my-6 opacity-20" />
          <p className="text-center text-sm opacity-60">
            © 2025 ГородNews. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
