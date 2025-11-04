import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SEO } from '@/components/SEO';
import { SiteHeader } from '@/components/SiteHeader';
import { HeroHorizontal } from '@/components/HeroHorizontal';
import { HorizontalNewsScroll } from '@/components/HorizontalNewsScroll';
import { EventsHorizontal } from '@/components/EventsHorizontal';
import { PlacesHorizontal } from '@/components/PlacesHorizontal';
import { ShowbizHorizontal } from '@/components/ShowbizHorizontal';
import { YouthHorizontal } from '@/components/YouthHorizontal';
import { Footer } from '@/components/Footer';


const FUNCTIONS_URL = {
  news: 'https://functions.poehali.dev/337d71bc-62a6-4d6d-bb49-7543546870fe',
  events: 'https://functions.poehali.dev/383dd478-9fc2-4b12-bcc4-72b87c103a3d',
  weather: 'https://functions.poehali.dev/5531fc0c-ecba-421c-bfb4-245613816060',
  comments: 'https://functions.poehali.dev/e442a5de-b5ed-4ff1-b15c-da8b0bfea9b5',
  cityPlaces: 'https://functions.poehali.dev/5db1b661-abf3-4bcb-8e1f-d01437219788',
  memory: 'https://functions.poehali.dev/524497f7-1b8d-4d18-9293-548392f10987',
  kudagoEvents: 'https://functions.poehali.dev/ab80cd05-8ada-45de-8a5f-dd7debe04ea3',
  syncKudago: 'https://functions.poehali.dev/9b3befac-d5bd-4a98-8d2b-f45edc14eb56',
  youthNotes: 'https://functions.poehali.dev/97a5ec9d-d662-4652-be23-350205ec6759'
};

const Index = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [cityPlaces, setCityPlaces] = useState<any[]>([]);
  const [youthNotes, setYouthNotes] = useState<any[]>([]);

  useEffect(() => {
    loadNews();
    loadEvents();
    loadCityPlaces();
    loadYouthNotes();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.news);
      if (!response.ok) return;
      const data = await response.json();
      
      if (!Array.isArray(data)) return;
      
      const filteredData = data.filter((article: any) => {
        const isSVO = article.tags && Array.isArray(article.tags) && article.tags.includes('СВО');
        const isShowbiz = article.is_showbiz === true;
        return !isSVO && !isShowbiz;
      });
      
      const sortedData = filteredData.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setArticles(sortedData);
    } catch (error) {
      console.error('Failed to load news:', error);
      setArticles([]);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.kudagoEvents);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    }
  };

  const loadCityPlaces = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.cityPlaces);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setCityPlaces(data.filter((p: any) => p.is_published));
      }
    } catch (error) {
      console.error('Failed to load city places:', error);
      setCityPlaces([]);
    }
  };

  const loadYouthNotes = async () => {
    try {
      const response = await fetch(FUNCTIONS_URL.youthNotes);
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setYouthNotes(data.filter((note: any) => note.is_published));
      }
    } catch (error) {
      console.error('Failed to load youth notes:', error);
      setYouthNotes([]);
    }
  };

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <>
      <SEO />
      <Helmet>
        <title>Город сегодня | Главная</title>
      </Helmet>
      
      <div className="min-h-screen bg-black">
        <SiteHeader onSectionChange={() => {}} activeSection="Главная" />
        
        <HeroHorizontal 
          news={articles.slice(0, 5)} 
          onNewsClick={handleNewsClick}
        />
        
        <EventsHorizontal events={events} />
        
        <HorizontalNewsScroll 
          news={articles.slice(5, 20)} 
          onNewsClick={handleNewsClick}
          title="Городские новости"
        />
        
        <PlacesHorizontal places={cityPlaces} />
        
        <ShowbizHorizontal />
        
        <YouthHorizontal notes={youthNotes} />
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
