import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FavoriteItem, WatchlistItem } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.api.baseUrl}/favorites`;
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Carregar favoritos do usuário
  loadFavorites(): Observable<FavoriteItem[]> {
    return this.http.get<FavoriteItem[]>(this.apiUrl).pipe(
      tap(favorites => this.favoritesSubject.next(favorites))
    );
  }

  // Adicionar aos favoritos
  addToFavorites(mediaType: 'movie' | 'series', mediaId: number, title: string, posterPath?: string): Observable<FavoriteItem> {
    return this.http.post<FavoriteItem>(this.apiUrl, {
      mediaType,
      mediaId,
      title,
      posterPath
    }).pipe(
      tap(favorite => {
        const current = this.favoritesSubject.value;
        this.favoritesSubject.next([...current, favorite]);
      })
    );
  }

  // Remover dos favoritos
  removeFromFavorites(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`).pipe(
      tap(() => {
        const current = this.favoritesSubject.value;
        this.favoritesSubject.next(current.filter(f => f.id !== favoriteId));
      })
    );
  }

  // Remover dos favoritos por mediaType e mediaId
  removeFromFavoritesByMedia(mediaType: 'movie' | 'series', mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${mediaType}/${mediaId}`).pipe(
      tap(() => {
        const current = this.favoritesSubject.value;
        this.favoritesSubject.next(current.filter(f => !(f.mediaType === mediaType && f.mediaId === mediaId)));
      })
    );
  }

  // Verificar se está nos favoritos
  isFavorite(mediaType: 'movie' | 'series', mediaId: number): Observable<boolean> {
    return this.http.get<{ isFavorite: boolean }>(`${this.apiUrl}/check/${mediaType}/${mediaId}`).pipe(
      map(response => response.isFavorite)
    );
  }

  // Obter favoritos por tipo
  getFavoritesByType(mediaType: 'movie' | 'series'): Observable<FavoriteItem[]> {
    return this.http.get<FavoriteItem[]>(`${this.apiUrl}/type/${mediaType}`);
  }
}
