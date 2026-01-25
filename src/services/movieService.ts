import axios from "axios"
import type { Movie } from "../types/movie"

interface FetchMoviesParams{
    page?:number,
    language?:string,
    include_adult?:boolean,
    query:string 
}

interface FetchMoviesResponse{
    page:number,
    results: Movie[],
    total_pages:number,
    total_results:number
}


const myKey = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies ({page = 1,language = 'en-US' ,include_adult = false, query}: FetchMoviesParams): Promise<FetchMoviesResponse> {
    try{const response = await axios<FetchMoviesResponse>({
        method:'GET',
        url:'https://api.themoviedb.org/3/search/movie',
        params:{
            page,
            language,
            include_adult,
            query
        },
        headers:{
            Authorization: `Bearer ${myKey}`,
            accept: `application/json`
        }
    }) 

    return response.data
    }
    catch (error){
        console.error('Error fetching movies:', error);
        throw error;
    }
}

