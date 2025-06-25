import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StreamingPage = () => {
  const { movieId } = useParams();
  const [movieTitle, setMovieTitle] = useState('');
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const embedUrl = `https://vidsrc.icu/embed/movie/${movieId}`;

  // Fetch movie details for title
  useEffect(() => {
    const fetchTitle = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`
        }
      });
      const data = await res.json();
      setMovieTitle(data.title || 'Now Streaming');
    };

    fetchTitle();
  }, [movieId]);
if (!movieId) {
  return (
    <div className="text-white text-center mt-10">
      <h2>No movie selected to stream</h2>
    </div>
  );
}

  // Fetch related movies
  useEffect(() => {
    const fetchRelated = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`
          }
        }
      );
      const data = await res.json();
      setRelatedMovies(data.results || []);
    };

    fetchRelated();
  }, [movieId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Search for the movie and navigate to its page
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&language=en-US&page=1`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`
        }
      }
    );
    const data = await res.json();
    if (data.results.length > 0) {
      navigate(`/watch/${data.results[0].id}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 pb-8">
      {/* Header / Search Bar */}
      <div className="text-center py-6">
        <div className="text-4xl font-bold text-indigo-400 mb-4">
        <h1><a href="/">CoolMovieHub</a></h1>
        </div>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center bg-gray-800 rounded-full shadow-md p-2">
          <input
            type="text"
            className="w-full bg-transparent text-white px-4 py-2 text-lg focus:outline-none"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Movie Player */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-3">{movieTitle}</h2>
        <div className="aspect-video bg-black rounded overflow-hidden shadow-xl">
          <iframe
            src={embedUrl}
            title="Streaming Player"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4">Related Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {relatedMovies.slice(0, 10).map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/watch/${movie.id}`)}
                className="cursor-pointer bg-gray-800 hover:bg-gray-700 rounded overflow-hidden shadow"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 text-sm text-white truncate">{movie.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingPage;
