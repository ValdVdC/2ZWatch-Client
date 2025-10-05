import { Movie } from "../../features/movies/models/movie.model";
import { Series } from "../../features/series/models/series.model";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  results?: T[];
  movies?: T[];
  series?: T[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  pageSize?: number;
  hasMore: boolean;
  totalPages?: number;
  totalResults?: number;
}

export interface GenreResponse {
  id: number;
  value: {
    genre: string;
    movies?: Movie[];
    series?: Series[];
  };
  status: string;
}

export interface SearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  year?: number;
  genre?: number;
}

export interface LoadingState {
  loading: boolean;
  error?: string;
}