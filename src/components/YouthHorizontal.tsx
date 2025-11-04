import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface YouthHorizontalProps {
  notes: any[];
}

export const YouthHorizontal = ({ notes }: YouthHorizontalProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (notes.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-r from-green-500 via-teal-600 to-blue-600 py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-[95vw] mx-auto">
        <div className="flex items-center justify-between mb-12 px-6 lg:px-12">
          <div>
            <h2 className="text-5xl lg:text-8xl font-black text-white">
              Молодёжь
            </h2>
            <p className="text-white/70 text-xl lg:text-2xl mt-2 font-bold">
              Голос поколения
            </p>
          </div>
          
          <div className="hidden lg:flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-green-600 transition-all"
            >
              <Icon name="ChevronLeft" size={28} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-green-600 transition-all"
            >
              <Icon name="ChevronRight" size={28} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-6 lg:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {notes.slice(0, 12).map((note) => (
            <article
              key={note.id}
              className="flex-shrink-0 w-[75vw] lg:w-[400px] group cursor-pointer"
              onClick={() => navigate('/youth-notes')}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl h-[500px] group-hover:scale-105 transition-transform duration-500">
                <img
                  src={note.image_url || "https://cdn.poehali.dev/projects/518f1174-a284-4a3c-8688-e7dee3a55931/files/59b006b6-44bf-4196-8142-5bb0337f0659.jpg"}
                  alt={note.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <div className="absolute top-6 left-6">
                  <span className="inline-block px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-full">
                    МОЛОДЁЖЬ
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-black text-xl lg:text-2xl leading-tight mb-3">
                    {note.title}
                  </h3>
                  
                  <p className="text-white/80 text-sm line-clamp-2 mb-3">
                    {note.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Icon name="Calendar" size={14} />
                    <span>
                      {new Date(note.created_at).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
