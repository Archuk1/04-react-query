import {useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import css from "./App.module.css"
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";



function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false)

  const handlSearch = async (newQuery: string)=>{
    try{

      setMovies([])
      setLoading(true)
      setIsError(false)
      const data = await fetchMovies({query:newQuery});
      if(data.results.length === 0){
        toast.error(`No movies found for your request.`)
      }

      setMovies(data.results)

    }catch{
      setIsError(true)
    }finally{
      setLoading(false)
    }

  } 

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpenModal(true)
  }

  const closeModal = () => {
    setIsOpenModal(false)
    setSelectedMovie(null)
  }

  return (<div className={css.app}>
    <SearchBar onSubmit={handlSearch}/>
    <Toaster/>
    {loading && <Loader />}
    {isError && <ErrorMessage/>}
    {isOpenModal && selectedMovie && <MovieModal onClose={closeModal} movie={selectedMovie}/>}
    {movies.length > 0 &&  <MovieGrid onSelect={openModal} movies={movies} />}
    </div>
  )
}

export default App
