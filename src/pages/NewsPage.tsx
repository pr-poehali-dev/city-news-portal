import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { MiniNewsCard } from '@/components/MiniNewsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Helmet } from 'react-helmet';

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
  author_name: string;
  text: string;
  created_at: string;
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
  const [promoUsageCount] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [displayCount, setDisplayCount] = useState(0);

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
            .filter((n: NewsArticle) => n.section === currentArticle.section && n.id !== currentArticle.id)
            .slice(0, 4);
          setRelatedNews(related);
          
          try {
            const commentsResponse = await fetch(`${FUNCTIONS_URL.comments}?news_id=${id}`);
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              setComments(commentsData || []);
            }
          } catch (error) {
            console.error('Error loading comments:', error);
          }
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

  useEffect(() => {
    if (!loading && article) {
      const duration = 1500;
      const steps = 60;
      const increment = promoUsageCount / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayCount(promoUsageCount);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(increment * currentStep));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [loading, article, promoUsageCount]);

  const handleAddComment = async () => {
    if (commentName.trim() && commentText.trim() && id) {
      try {
        const response = await fetch('https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            news_id: parseInt(id),
            author_name: commentName.trim(),
            text: commentText.trim()
          })
        });
        
        if (response.ok) {
          const newComment = await response.json();
          setComments([newComment, ...comments]);
          setCommentName('');
          setCommentText('');
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
        alert('Не удалось добавить комментарий. Попробуйте позже.');
      }
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

  const pageTitle = article ? `${article.title} — Город говорит` : 'Город говорит — новостной портал Краснодара';
  const pageDescription = article?.content?.substring(0, 155) || 'Актуальные новости Краснодара';
  const pageImage = article?.image_url || 'https://cdn.poehali.dev/intertnal/img/og.png';
  const pageUrl = `https://ggkrasnodar.ru/news/${id}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="Город говорит" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

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

      <main className="pt-16">
        <div className="container mx-auto px-4 py-1">
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

          <div className="container mx-auto px-4 max-w-4xl mb-8">
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full h-auto rounded-lg object-contain max-h-[500px]"
            />
          </div>

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

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 border-4 border-pink-400 p-6 md:p-8 mb-12 hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                 onClick={() => {
                   navigate('/');
                   setTimeout(() => {
                     document.getElementById('partner')?.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
                 }}>
              <div className="absolute top-4 right-4 animate-bounce">
                <Icon name="Sparkles" size={32} className="text-pink-500 drop-shadow-lg" />
              </div>
              <div className="absolute top-4 left-4 animate-pulse">
                <Icon name="PartyPopper" size={32} className="text-orange-500 drop-shadow-lg" />
              </div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    🎁 Подарок от LaaKids для читателей!
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Агентство детских праздников дарит специальную скидку
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-2 border-orange-500/30 rounded-xl p-4 md:p-5 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                      <Icon name="Gift" size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">Специальное предложение!</p>
                      <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                        500 ₽ скидка при переходе с «Город говорит»
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-orange-300/30 pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Промокод для скидки:</p>
                    <div className="bg-white border-2 border-dashed border-pink-400 rounded-lg px-4 py-3 text-center">
                      <p className="font-mono font-bold text-xl md:text-2xl text-pink-600 tracking-wider">
                        Праздник500
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Icon name="Users" size={16} className="text-green-600" />
                  <span>Промокодом уже воспользовались <span className="font-bold text-green-600 tabular-nums">{displayCount}</span> {displayCount === 1 ? 'человек' : displayCount < 5 && displayCount > 0 ? 'человека' : 'человек'}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/79508270441?text=${encodeURIComponent('Праздник500')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:scale-110 transition-all duration-300 animate-whatsapp-glow"
                  >
                    <Icon name="MessageCircle" size={20} />
                    <span>Написать в WhatsApp</span>
                    <Icon name="ArrowRight" size={20} />
                  </a>
                  
                  <a
                    href="https://laakids.ru"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Icon name="Info" size={20} />
                    Узнать больше о партнёре
                  </a>
                </div>
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
                    <span className="font-semibold">{comment.author_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
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