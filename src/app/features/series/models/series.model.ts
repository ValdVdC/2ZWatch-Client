import { Credits, Images, ProductionCompany, ProductionCountry, SpokenLanguage, Video } from "../../movies/models/movie.model";

export interface Series {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  last_air_date?: string;
  release_year?: number;
  poster_path: string;
  poster_url?: string;
  backdrop_path: string;
  backdrop_url?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  genres?: string[];
  original_language: string;
  origin_country: string[];
}

export interface SeriesDetail extends Series {
  created_by: Creator[];
  episode_run_time: number[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  networks: Network[];
  credits?: Credits;
  videos?: Video[];
  images?: Images;
  similar_series?: Series[];
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path?: string;
}

export interface Season {
  id: number;
  air_date: string;
  episode_count: number;
  name: string;
  overview: string;
  poster_path?: string;
  season_number: number;
}

export interface Network {
  id: number;
  name: string;
  logo_path?: string;
  origin_country: string;
}