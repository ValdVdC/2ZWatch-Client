import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {
  private readonly endpoint = '/taxonomy';

  constructor(private apiService: ApiService) {}

  getMovieGenres(): Observable<{[key: string]: string}> {
    return this.apiService.get<{[key: string]: string}>(`${this.endpoint}/movie-genres`);
  }

  getSeriesGenres(): Observable<{[key: string]: string}> {
    return this.apiService.get<{[key: string]: string}>(`${this.endpoint}/series-genres`);
  }

  getLanguages(): Observable<{[key: string]: string}> {
    return this.apiService.get<{[key: string]: string}>(`${this.endpoint}/languages`);
  }

  getCountries(): Observable<{[key: string]: string}> {
    return this.apiService.get<{[key: string]: string}>(`${this.endpoint}/countries`);
  }

  getConfiguration(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/configuration`);
  }
}