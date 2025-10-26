import { useState, useEffect } from 'react';
import { Film, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster: string;
  description: string;
  kinopoisk_url: string;
  director: string;
  genres: string[];
}

export function CityWatchesSection() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopMovies();
  }, []);

  const fetchTopMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://functions.poehali.dev/8276deb7-23a1-45e7-b53f-390b386d0d71?limit=2&offset=0'
      );
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-transparent" />
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/5 animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <Film className="w-12 h-12 text-primary animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
            Город смотрит
          </h2>
          <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
        </div>
        
        <p className="text-center text-lg text-muted-foreground mb-8">
          Лучшие фильмы, которые должен посмотреть каждый
        </p>

        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[450px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} size="large" />
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/movies')}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>Все фильмы топ-250</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
