import { useState, useEffect } from 'react';
import { Film, Sparkles } from 'lucide-react';
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

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    fetchMovies();
  }, [offset]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://functions.poehali.dev/8276deb7-23a1-45e7-b53f-390b386d0d71?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setMovies(data.movies);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const hasMore = offset + limit < total;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-950/5 to-background">
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-pulse"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 3 + 2 + 's',
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Film className="w-16 h-16 text-primary animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400">
              Город смотрит
            </h1>
            <Sparkles className="w-16 h-16 text-pink-400 animate-pulse" />
          </div>
          <p className="text-center text-xl text-muted-foreground max-w-2xl mx-auto">
            Топ-250 лучших фильмов по версии Кинопоиска
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {loading && offset === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {movies.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Загрузка...' : 'Загрузить ещё'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
