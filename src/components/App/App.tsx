import {useEffect, useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import css from "./App.module.css"
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';



function App() {
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [newQuery, setNewQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const {data, isError, isLoading, isSuccess} = useQuery({
    queryKey:['query', newQuery, currentPage],
    queryFn: () => fetchMovies({query: newQuery, page:currentPage}),
    enabled: newQuery !== '',
    placeholderData: keepPreviousData,
  })

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;


 useEffect(() => {
  if (data?.results?.length === 0) {
    toast("Opps...No movies found");
  }
 }, [data]);


  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpenModal(true)
  }

  const closeModal = () => {
    setIsOpenModal(false)
    setSelectedMovie(null)
  }

  return (<div className={css.app}>
    <SearchBar onSubmit={setNewQuery}/>
    <Toaster/>
    {isLoading && <Loader />}
    {isError && <ErrorMessage/>}
    {isOpenModal && selectedMovie && <MovieModal onClose={closeModal} movie={selectedMovie}/>}
    {isSuccess && totalPages > 1 && <ReactPaginate 
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
/>}
    {isSuccess && movies.length > 0 &&  <MovieGrid onSelect={openModal} movies={movies} />}
    </div>
  )
}

export default App
