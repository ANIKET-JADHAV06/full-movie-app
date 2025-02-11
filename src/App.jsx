
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import { useState, useEffect } from "react";
import {useDebounce} from 'react-use'

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");

  //const [trendingMovies, setTrendingMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setmovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [debounceSearchTerm, setdebounceSearchTerm] = useState('');

  useDebounce(()=> setdebounceSearchTerm(searchTerm),500,[searchTerm])

  const fetchMovies = async (query ="") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {

        throw new Error("Failed to Fetch Movies !!");
      }

      const data = await response.json();
      console.log("API Response:", data); 

      if (!data.results || data.results.length === 0) {
        setErrorMessage(data.status_message || "No movies found.");
        setmovieList([]);
        return;
      } 
      else {
        setmovieList([...data.results]);
      }
      console.log("Fetching Is Done");
      //setmovieList(data.results || []);

    } catch (error) {

      console.log("Error Fetching Movie: " , error);

      setErrorMessage("Error Fetching Movies .Please Try Again Later.");

    } finally {
      //console.log("Fetching Is Done");
      setIsLoading(false);
      //console.log("Final State:",isLoading)
    }
  };
  // const loadTrendingMovies = async () => {
  //   try {
  //     const movies = await getTrendingMovies();

  //     setTrendingMovies(movies);
  //   } catch (error) {
  //     console.error(`Error fetching trending movies: ${error}`);
  //   }
  // };

  useEffect(() => {
    console.log("Fetching movies for search term:", debounceSearchTerm);
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);


  // useEffect(() => {
  //   loadTrendingMovies(); // ✅ Calls the function properly
  // }, []); // ✅ Empty dependency array to run once on mount

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">

        <header>
          <img className="logo" src="./logo.png" alt="MovieLand"/>
          <img src="./hero-img.png" alt="hero-banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You will Enjoy
            Without the Hassle{" "}
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* 
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )} */}

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.length > 0 ? (
                movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                <p className="text-gray-500">No movies found</p>
              )}
            </ul>
          )}
        </section>
        <footer className="bg-black-200 text-center dark:0f0d23 lg:text-left mt-[20px]">
          <div className="p-4 text-center text-neutral-500 dark:text-black-400">
            © 2025 Copyright  
            <a className="text-neutral-500 dark:text-black-400">
              <br/>AniketJadhav
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default App;
