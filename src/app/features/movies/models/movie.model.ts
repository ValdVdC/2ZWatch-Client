export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  release_year?: number;
  poster_path: string;
  poster_url?: string;
  backdrop_path: string;
  backdrop_url?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  genre_ids: number[];
  genres?: string[];
  original_language: string;
}

export interface MovieDetail extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  status: string;
  tagline: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection?: Collection;
  credits?: Credits;
  videos?: Video[];
  images?: Images;
  similar_movies?: Movie[];
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
  logo_url?: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
  poster_url?: string;
  backdrop_url?: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  profile_url?: string;
  order: number;
  credit_id: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_url?: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site?: string;
  size?: number;
  type: string;
  official?: boolean;
  published_at?: string;
  url: string;
}

export interface Images {
  backdrops: ImageItem[];
  posters: ImageItem[];
}

export interface ImageItem {
  aspect_ratio?: number;
  file_path: string;
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
  url: string;
}