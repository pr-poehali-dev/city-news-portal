import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { MagneticCard } from './MagneticCard';

interface HeroSectionProps {
  mainNews: any;
  sideNews: any[];
  onNewsClick: (newsId: number) => void;
}

export const HeroSection = ({ mainNews, sideNews, onNewsClick }: HeroSectionProps) => {
  if (!mainNews) return null;

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
  };

  return (
    <section className="py-12 lg:py-20 px-6 lg:px-20 bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-3 bg-red-600 px-6 py-3 rounded-full mb-6">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Сейчас читают
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-16">
          <MagneticCard
            onClick={() => onNewsClick(mainNews.id)}
            className="cursor-pointer"
          >
            <div className="group bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100">
              <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
                <img
                  src={mainNews.image_url || mainNews.image || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                  alt={mainNews.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <span className="inline-block text-xs font-bold text-red-500 uppercase tracking-wider mb-4 bg-white px-4 py-2 rounded-full">
                    {mainNews.category}
                  </span>
                  
                  <h2 className="text-white text-3xl lg:text-5xl font-black leading-tight mb-4">
                    {mainNews.title}
                  </h2>
                  
                  <p className="text-white/80 text-base lg:text-xl mb-6 line-clamp-2">
                    {stripHtml(mainNews.excerpt || mainNews.content).slice(0, 150)}...
                  </p>
                  
                  <div className="flex items-center gap-6 text-white/60 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} />
                      <span>{mainNews.author_name}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/40"></div>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} />
                      <span>
                        {new Date(mainNews.created_at).toLocaleDateString('ru-RU', { 
                          day: 'numeric', 
                          month: 'long'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MagneticCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {sideNews.slice(0, 2).map((news) => (
              <MagneticCard
                key={news.id}
                onClick={() => onNewsClick(news.id)}
                className="cursor-pointer"
              >
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 h-full">
                  <div className="flex flex-col sm:flex-row lg:flex-row h-full">
                    <div className="relative w-full sm:w-1/2 lg:w-2/5 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={news.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 block">
                          {news.category}
                        </span>
                        
                        <h3 className="text-gray-900 text-lg lg:text-xl font-bold leading-tight mb-3 line-clamp-3">
                          {news.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Icon name="Calendar" size={12} />
                        <span>{new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            ))}
          </div>
        </div>

        {sideNews.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sideNews.slice(2, 5).map((news) => (
              <MagneticCard
                key={news.id}
                onClick={() => onNewsClick(news.id)}
                className="cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={news.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-6">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3 block">
                      {news.category}
                    </span>
                    
                    <h3 className="text-gray-900 text-lg font-bold leading-tight mb-3 line-clamp-2">
                      {news.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Icon name="Calendar" size={12} />
                      <span>{new Date(news.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
              </MagneticCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
