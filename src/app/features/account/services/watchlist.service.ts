import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { WatchlistItem } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = `${environment.api.baseUrl}/watchlist`;
  private watchlistSubject = new BehaviorSubject<WatchlistItem[]>([]);
  public watchlist$ = this.watchlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Carregar watchlist do usuário
  loadWatchlist(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(this.apiUrl).pipe(
      tap(watchlist => this.watchlistSubject.next(watchlist))
    );
  }

  // Adicionar à watchlist
  addToWatchlist(
    mediaType: 'movie' | 'series',
    mediaId: number,
    title: string,
    posterPath?: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    notes?: string
  ): Observable<WatchlistItem> {
    return this.http.post<WatchlistItem>(this.apiUrl, {
      mediaType,
      mediaId,
      title,
      posterPath,
      priority,
      notes
    }).pipe(
      tap(item => {
        const current = this.watchlistSubject.value;
        this.watchlistSubject.next([...current, item]);
      })
    );
  }

  // Remover da watchlist
  removeFromWatchlist(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${itemId}`).pipe(
      tap(() => {
        const current = this.watchlistSubject.value;
        this.watchlistSubject.next(current.filter(i => i.id !== itemId));
      })
    );
  }

  // Remover da watchlist por mediaType e mediaId
  removeFromWatchlistByMedia(mediaType: 'movie' | 'series', mediaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${mediaType}/${mediaId}`).pipe(
      tap(() => {
        const current = this.watchlistSubject.value;
        this.watchlistSubject.next(current.filter(item => !(item.mediaType === mediaType && item.mediaId === mediaId)));
      })
    );
  }

  // Atualizar prioridade
  updatePriority(itemId: string, priority: 'low' | 'medium' | 'high'): Observable<WatchlistItem> {
    return this.http.patch<WatchlistItem>(`${this.apiUrl}/${itemId}/priority`, { priority }).pipe(
      tap(updated => {
        const current = this.watchlistSubject.value;
        const index = current.findIndex(i => i.id === itemId);
        if (index !== -1) {
          current[index] = updated;
          this.watchlistSubject.next([...current]);
        }
      })
    );
  }

  // Atualizar notas
  updateNotes(itemId: string, notes: string): Observable<WatchlistItem> {
    return this.http.patch<WatchlistItem>(`${this.apiUrl}/${itemId}/notes`, { notes }).pipe(
      tap(updated => {
        const current = this.watchlistSubject.value;
        const index = current.findIndex(i => i.id === itemId);
        if (index !== -1) {
          current[index] = updated;
          this.watchlistSubject.next([...current]);
        }
      })
    );
  }

  // Verificar se está na watchlist
  isInWatchlist(mediaType: 'movie' | 'series', mediaId: number): Observable<boolean> {
    return this.http.get<{ isInWatchlist: boolean }>(`${this.apiUrl}/check/${mediaType}/${mediaId}`).pipe(
      map(response => response.isInWatchlist)
    );
  }

  // Obter watchlist por prioridade
  getWatchlistByPriority(priority: 'low' | 'medium' | 'high'): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.apiUrl}/priority/${priority}`);
  }
}
