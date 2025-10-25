import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MemoryArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  year: number;
  decade: string;
  event_date: string;
  image_url: string;
  is_published: boolean;
}

interface MemorySectionProps {
  articles: MemoryArticle[];
  onArticleClick: (id: number) => void;
}

export function MemorySection({ articles, onArticleClick }: MemorySectionProps) {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const publishedArticles = articles.filter(a => a.is_published);
  
  if (publishedArticles.length === 0) return null;

  const totalSets = Math.ceil(publishedArticles.length / 3);
  const currentArticles = publishedArticles.slice(currentSetIndex * 3, (currentSetIndex * 3) + 3);

  useEffect(() => {
    if (publishedArticles.length <= 3) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSetIndex(prev => (prev + 1) % totalSets);
        setIsAnimating(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [publishedArticles.length, totalSets]);

  const handleViewAll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Город помнит</h2>
          <p className="text-muted-foreground">Историческая хроника городских событий</p>
        </div>
        {publishedArticles.length > 3 && (
          <Button variant="outline" className="gap-2" onClick={handleViewAll}>
            Все статьи
            <Icon name="Clock" size={16} />
          </Button>
        )}
      </div>

      <div 
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentArticles[0] && (
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-background dark:from-amber-950/40 dark:via-orange-950/20 dark:to-background border-4 border-double border-amber-400/60 dark:border-amber-700/60 relative overflow-hidden shadow-[0_4px_20px_rgba(217,119,6,0.15)] md:row-span-2"
            onClick={() => onArticleClick(currentArticles[0].id)}
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(217, 119, 6, 0.05) 100%), repeating-linear-gradient(90deg, transparent, transparent 25px, rgba(217, 119, 6, 0.02) 25px, rgba(217, 119, 6, 0.02) 50px)',
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute top-2 right-2 w-16 h-16 border border-amber-300/20 rounded-full rotate-12 opacity-30" />
            
            <CardContent className="p-0 relative h-full flex flex-col">
              {currentArticles[0].image_url && (
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={currentArticles[0].image_url}
                    alt={currentArticles[0].title}
                    className="w-full h-full object-cover sepia-[0.4] contrast-110 hover:sepia-[0.2] transition-all duration-500 border-b-2 border-amber-400/30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
                  <div className="absolute inset-0 border-8 border-amber-900/10" />
                  
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-6 py-3 border-2 border-amber-400/80">
                    <span className="text-3xl font-serif font-bold text-amber-100 tracking-wider">{currentArticles[0].year}</span>
                  </div>
                </div>
              )}
              
              <div className="p-6 bg-gradient-to-b from-transparent to-amber-50/30 dark:to-amber-950/20 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-300/30">
                  <div className="w-8 h-px bg-amber-600" />
                  <Icon name="Clock" size={14} className="text-amber-700" />
                  <span className="text-xs text-amber-800 dark:text-amber-400 font-serif uppercase tracking-widest">
                    {currentArticles[0].decade || `${currentArticles[0].year}-е годы`}
                  </span>
                  <div className="flex-1 h-px bg-amber-600" />
                </div>
                
                <h3 className="text-2xl font-serif font-bold mb-3 leading-tight text-amber-950 dark:text-amber-100 hover:text-amber-800 dark:hover:text-amber-300 transition-colors border-l-4 border-amber-600 pl-3">
                  {currentArticles[0].title}
                </h3>
                
                <div className="relative mb-4 flex-1">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:mt-1">
                    {currentArticles[0].excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-amber-300/30">
                  <span className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2 font-serif italic">
                    <Icon name="Calendar" size={14} />
                    {currentArticles[0].event_date 
                      ? new Date(currentArticles[0].event_date).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })
                      : `${currentArticles[0].year} год`
                    }
                  </span>
                  
                  <Button variant="ghost" size="sm" className="text-amber-800 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 font-serif">
                    Читать далее →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {currentArticles.slice(1, 3).map((article) => (
            <Card 
              key={article.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-background dark:from-amber-950/40 dark:via-orange-950/20 dark:to-background border-2 border-amber-400/40 dark:border-amber-700/40 relative overflow-hidden"
              onClick={() => onArticleClick(article.id)}
            >
              <CardContent className="p-0 relative">
                <div className="flex gap-4">
                  {article.image_url && (
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover sepia-[0.4] contrast-110 hover:sepia-[0.2] transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50" />
                      
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 border border-amber-400/80">
                        <span className="text-lg font-serif font-bold text-amber-100">{article.year}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Clock" size={12} className="text-amber-700" />
                      <span className="text-xs text-amber-800 dark:text-amber-400 font-serif">
                        {article.decade || `${article.year}-е`}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-serif font-bold mb-2 leading-tight text-amber-950 dark:text-amber-100 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-serif">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}