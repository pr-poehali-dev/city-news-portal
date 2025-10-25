import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { MiniNewsCard } from '@/components/MiniNewsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d',
};

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  image_url: string;
  section: string;
}

interface Comment {
  id: number;
  name: string;
  text: string;
  date: string;
}

export const NewsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const articleResponse = await fetch(`${FUNCTIONS_URL.news}?id=${id}&increment_views=true`);
        const currentArticle = await articleResponse.json();
        
        if (currentArticle && currentArticle.id) {
          setArticle(currentArticle);
          
          const allNewsResponse = await fetch(FUNCTIONS_URL.news);
          const allNews = await allNewsResponse.json();
          const related = allNews
            .filter((n: NewsArticle) => n.category === currentArticle.category && n.id !== currentArticle.id)
            .slice(0, 4);
          setRelatedNews(related);
        }

        const allSections = ['Главная', 'Спорт', 'Культура', 'Экономика', 'Политика', 'Общество'];
        setSections(allSections);
        setLoading(false);
      } catch (error) {
        console.error('Error loading news:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAddComment = () => {
    if (commentName.trim() && commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        name: commentName,
        text: commentText,
        date: new Date().toLocaleDateString('ru-RU')
      };
      setComments([...comments, newComment]);
      setCommentName('');
      setCommentText('');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована!');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article?.title || '';
    
    const urls: { [key: string]: string } = {
      vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    window.open(urls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Новость не найдена</h1>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader 
        sections={sections} 
        onSectionChange={(section) => {
          navigate('/');
          setTimeout(() => {
            const element = document.getElementById(section);
            element?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }} 
      />

      <main className="mt-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="-ml-3"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
        </div>

        <article>
          <div className="container mx-auto px-4 mb-3 max-w-4xl">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-3">
              {article.section}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mb-3 break-words">{article.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Icon name="User" size={16} />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Calendar" size={16} />
                {article.date}
              </span>
            </div>
          </div>

          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-auto mb-8"
          />

          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-sm md:prose-lg max-w-none mb-12">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed break-words">
                {article.content}
              </p>
            </div>

            <div className="border-t border-border pt-8 mb-12">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Поделиться:</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleCopyLink} className="text-xs md:text-sm">
                  <Icon name="Link" size={16} className="mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Копировать ссылку</span>
                  <span className="sm:hidden">Ссылка</span>
                </Button>
                <Button variant="outline" onClick={() => handleShare('vk')} className="text-xs md:text-sm">
                  <Icon name="Share2" size={16} className="mr-1 md:mr-2" />
                  ВКонтакте
                </Button>
                <Button variant="outline" onClick={() => handleShare('telegram')} className="text-xs md:text-sm">
                  <Icon name="Send" size={16} className="mr-1 md:mr-2" />
                  Telegram
                </Button>
                <Button variant="outline" onClick={() => handleShare('whatsapp')} className="text-xs md:text-sm">
                  <Icon name="MessageCircle" size={16} className="mr-1 md:mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {relatedNews.length > 0 && (
              <div className="border-t border-border pt-12 mb-12">
                <h3 className="text-xl md:text-2xl font-semibold mb-6">Читайте также</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedNews.map((news) => (
                    <MiniNewsCard
                      key={news.id}
                      news={news}
                      onClick={() => {
                        navigate(`/news/${news.id}`);
                        window.scrollTo(0, 0);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-border pt-12">
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                Комментарии ({comments.length})
              </h3>

              <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{comment.name}</span>
                    <span className="text-sm text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="text-foreground">{comment.text}</p>
                </div>
              ))}
            </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h4 className="text-lg font-semibold mb-4">Оставить комментарий</h4>
                <div className="space-y-4">
                  <Input
                    placeholder="Ваше имя"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Ваш комментарий"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleAddComment} className="w-full">
                    Отправить комментарий
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer sections={sections} onSectionChange={(section) => {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(section);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }} />
    </div>
  );
};

export default NewsPage;