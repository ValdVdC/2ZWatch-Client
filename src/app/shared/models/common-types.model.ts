// Common types used across the application

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
  order?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface QueryParams {
  page?: number;
  query?: string;
  genre?: string | number;
  year?: number;
  sort_by?: string;
  with_genres?: string;
  primary_release_year?: number;
  first_air_date_year?: number;
  [key: string]: string | number | undefined;
}

export interface SearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface PriorityEmoji {
  high: string;
  medium: string;
  low: string;
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export interface ImageLightboxData {
  url: string;
  alt?: string;
}
