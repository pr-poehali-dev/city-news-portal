import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Helmet } from 'react-helmet';

const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  comments: 'https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5',
};

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  author: string;
  image_url: string;
  section: string;
  keywords?: string;
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
  const [loading, setLoading] = useState(true);
  const adRenderedRef = useRef(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Дата не указана';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Дата не указана';
      return date.toLocaleDateString('ru-RU');
    } catch {
      return 'Дата не указана';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        adRenderedRef.current = false;
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

        setLoading(false);
      } catch (error) {
        console.error('Error loading news:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!loading && article && !adRenderedRef.current) {
      const timer = setTimeout(() => {
        if (window.yaContextCb && !adRenderedRef.current) {
          window.yaContextCb.push(() => {
            if (window.Ya?.Context?.AdvManager) {
              window.Ya.Context.AdvManager.render({
                blockId: "R-A-17651616-3",
                type: "topAd"
              });
              window.Ya.Context.AdvManager.render({
                blockId: "R-A-17651616-1",
                renderTo: "yandex_rtb_R-A-17651616-1",
                type: "feed"
              });
              adRenderedRef.current = true;
            }
          });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, article]);

  const handleAddComment = async () => {
    if (commentName.trim() && commentText.trim() && id) {
      try {
        const response = await fetch(FUNCTIONS_URL.comments, {
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
        <div className="text-muted-foreground font-bold uppercase">Загрузка...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 uppercase">Новость не найдена</h1>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </div>
      </div>
    );
  }

  const pageTitle = article ? `${article.title} — Город говорит` : 'Город говорит — новостной портал Краснодара';
  const pageDescription = article?.excerpt || article?.content?.substring(0, 155) || 'Актуальные новости Краснодара';
  const pageImage = article?.image_url || 'https://cdn.poehali.dev/intertnal/img/og.png';
  const pageUrl = `https://ggkrasnodar.ru/news/${id}`;
  const pageKeywords = article?.keywords || `новости Краснодара, ${article?.section || 'события'}, ${article?.title?.substring(0, 50) || ''}`;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="Город говорит" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.section} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        <script async src="https://yandex.ru/ads/system/context.js"></script>
      </Helmet>

      <div className="sticky top-0 z-50">
        <SiteHeader />
      </div>

      <div id="yandex_rtb_R-A-17651616-3"></div>

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <Icon name="ArrowLeft" size={16} className="group-hover:-translate-x-1 transition-transform" />
            На главную
          </Link>

          <article className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-accent px-4 py-2 border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-white font-black text-xs uppercase tracking-wider">
                  {article.section}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-[1.1] tracking-tight text-black break-words">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-black/60 font-bold uppercase">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} />
                  {article.author}
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  {formatDate(article.date)}
                </div>
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden border-4 border-primary shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black
                prose-p:text-black prose-p:leading-relaxed
                prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-strong:font-black prose-strong:text-black
                prose-ul:list-none prose-ul:pl-0 prose-li:pl-6 prose-li:relative prose-li:before:content-['▪'] prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-accent prose-li:before:font-black prose-li:text-black"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="border-t-4 border-primary pt-6">
              <h3 className="text-lg font-black uppercase mb-4">Поделиться:</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleShare('vk')}
                  className="bg-[#0077FF] hover:bg-[#0077FF]/90 text-white font-black uppercase border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <Icon name="Share2" size={16} className="mr-2" />
                  VK
                </Button>
                <Button
                  onClick={() => handleShare('telegram')}
                  className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-black uppercase border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <Icon name="Send" size={16} className="mr-2" />
                  Telegram
                </Button>
                <Button
                  onClick={() => handleShare('whatsapp')}
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-black uppercase border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="font-black uppercase border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <Icon name="Link" size={16} className="mr-2" />
                  Копировать ссылку
                </Button>
              </div>
            </div>
          </article>

          {relatedNews.length > 0 && (
            <section className="mt-12 border-t-4 border-primary pt-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 tracking-tight">Читайте также</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedNews.map((news) => (
                  <Link
                    key={news.id}
                    to={`/news/${news.id}`}
                    className="group"
                  >
                    <div className="aspect-video relative overflow-hidden bg-black border-4 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                      <img
                        src={news.image_url}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white text-lg font-black uppercase leading-tight tracking-tighter group-hover:text-accent transition-colors [text-shadow:_2px_2px_0_rgb(0_0_0_/_100%)]">
                          {news.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12 border-t-4 border-primary pt-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 tracking-tight">
              Комментарии ({comments.length})
            </h2>

            <div className="bg-accent/5 border-4 border-primary p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black uppercase mb-4">Оставить комментарий</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Ваше имя"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="font-bold border-2 border-primary"
                />
                <Textarea
                  placeholder="Ваш комментарий"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  className="font-medium border-2 border-primary"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!commentName.trim() || !commentText.trim()}
                  className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white font-black uppercase border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase">Пока нет комментариев. Будьте первым!</p>
                </div>
              )}
              
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white border-4 border-primary p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-black text-lg border-2 border-primary flex-shrink-0">
                      {comment.author_name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-black uppercase">{comment.author_name}</span>
                        <span className="text-muted-foreground text-sm">
                          {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed break-words">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div id="yandex_rtb_R-A-17651616-1" className="mt-8"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;