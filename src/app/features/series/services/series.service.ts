import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Series, SeriesDetail } from '../models/series.model';
import { PaginatedResponse, GenreResponse, SearchParams } from '../../../shared/models/common.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private readonly endpoint = '/series';

  constructor(private apiService: ApiService) {}

  getPopularSeries(params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/popular`, params);
  }

  getNowPlayingSeries(params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/now-playing`, params);
  }

  getUpcomingSeries(params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/upcoming`, params);
  }

  getTopRatedSeries(params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/top-rated`, params);
  }

  getSeriesDetails(id: number): Observable<SeriesDetail> {
    return this.apiService.get<SeriesDetail>(`${this.endpoint}/${id}`);
  }

  searchSeries(query: string, params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/search/${encodeURIComponent(query)}`, params);
  }

  getSeriesByGenre(): Observable<GenreResponse[]> {
    return this.apiService.get<GenreResponse[]>(`${this.endpoint}/genres`);
  }

  getSeriesByYear(year: number, params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/year/${year}`, params);
  }

  getSimilarSeries(id: number, params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/${id}/similar`, params);
  }

  getSeriesRecommendations(id: number, params?: SearchParams): Observable<PaginatedResponse<Series>> {
    return this.apiService.get<PaginatedResponse<Series>>(`${this.endpoint}/${id}/recommendations`, params);
  }

  getSeriesKeywords(id: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/${id}/keywords`);
  }
}