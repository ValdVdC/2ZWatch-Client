import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Rating {
  userId: string;
  mediaType: 'movie' | 'series';
  mediaId: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingAverage {
  average: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.api.baseUrl}/ratings`;

  constructor(private http: HttpClient) {}

  // Adicionar ou atualizar avaliação
  setRating(mediaType: 'movie' | 'series', mediaId: number, rating: number): Observable<{ message: string; rating: Rating }> {
    return this.http.post<{ message: string; rating: Rating }>(this.apiUrl, {
      mediaType,
      mediaId,
      rating
    });
  }

  // Obter avaliação do usuário
  getUserRating(mediaType: 'movie' | 'series', mediaId: number): Observable<{ rating: number | null }> {
    return this.http.get<{ rating: number | null }>(`${this.apiUrl}/${mediaType}/${mediaId}/user`);
  }

  // Obter média de avaliações
  getAverageRating(mediaType: 'movie' | 'series', mediaId: number): Observable<RatingAverage> {
    return this.http.get<RatingAverage>(`${this.apiUrl}/${mediaType}/${mediaId}/average`);
  }

  // Deletar avaliação
  deleteRating(mediaType: 'movie' | 'series', mediaId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${mediaType}/${mediaId}`);
  }
}
