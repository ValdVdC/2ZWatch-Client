import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie, MovieDetail } from '../models/movie.model';
import { PaginatedResponse, GenreResponse, SearchParams } from '../../../shared/models/common.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly endpoint = '/movies';

  constructor(private apiService: ApiService) {}

  getPopularMovies(params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/popular`, params);
  }

  getNowPlayingMovies(params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/now-playing`, params);
  }

  getUpcomingMovies(params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/upcoming`, params);
  }

  getTopRatedMovies(params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/top-rated`, params);
  }

  getMovieDetails(id: number): Observable<MovieDetail> {
    return this.apiService.get<MovieDetail>(`${this.endpoint}/${id}`);
  }

  searchMovies(query: string, params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/search/${encodeURIComponent(query)}`, params);
  }

  getMoviesByGenre(): Observable<GenreResponse[]> {
    return this.apiService.get<GenreResponse[]>(`${this.endpoint}/genres`);
  }

  getMoviesByYear(year: number, params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/year/${year}`, params);
  }

  getSimilarMovies(id: number, params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/${id}/similar`, params);
  }

  getMovieRecommendations(id: number, params?: SearchParams): Observable<PaginatedResponse<Movie>> {
    return this.apiService.get<PaginatedResponse<Movie>>(`${this.endpoint}/${id}/recommendations`, params);
  }

  getMovieKeywords(id: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/${id}/keywords`);
  }
}