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
  const publishedArticles = articles.filter(a => a.is_published);
  
  if (publishedArticles.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Город помнит</h2>
          <p className="text-muted-foreground">Историческая хроника городских событий</p>
        </div>
        <Button variant="outline" className="gap-2">
          Посмотреть все
          <Icon name="Clock" size={16} />
        </Button>
      </div>

      <div className="relative">
        {/* Временная шкала */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 hidden md:block" />
        
        <div className="space-y-12">
          {publishedArticles.slice(0, 4).map((article, index) => {
            const isLeft = index % 2 === 0;
            
            return (
              <div key={article.id} className="relative">
                {/* Точка на временной шкале */}
                <div className="absolute left-1/2 top-8 w-4 h-4 bg-amber-500 rounded-full border-4 border-background -translate-x-1/2 z-10 hidden md:block shadow-lg" />
                
                <div className={`grid md:grid-cols-2 gap-8 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                  {/* Пустая колонка для выравнивания */}
                  <div className={`${isLeft ? '' : 'md:order-2'} hidden md:block`} />
                  
                  {/* Контент */}
                  <div className={`${isLeft ? '' : 'md:order-1'}`}>
                    <Card 
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background border-amber-200 dark:border-amber-900"
                      onClick={() => onArticleClick(article.id)}
                    >
                      <CardContent className="p-0">
                        {article.image_url && (
                          <div className="relative h-48 overflow-hidden rounded-t-lg">
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover sepia-[0.3] hover:sepia-0 transition-all duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Год на изображении */}
                            <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                              <span className="text-2xl font-bold text-white">{article.year}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Icon name="Clock" size={16} className="text-amber-600" />
                            <span className="text-xs text-amber-700 dark:text-amber-500 font-semibold uppercase tracking-wide">
                              {article.decade || `${article.year}-е`}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 hover:text-amber-700 dark:hover:text-amber-500 transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              {article.event_date 
                                ? new Date(article.event_date).toLocaleDateString('ru-RU', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })
                                : article.year
                              }
                            </span>
                            
                            <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400">
                              Читать →
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {publishedArticles.length > 4 && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" className="gap-2">
            Показать ещё
            <Icon name="ChevronDown" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
