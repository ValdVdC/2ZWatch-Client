import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommunityPost } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = `${environment.api.baseUrl}/community`;
  private postsSubject = new BehaviorSubject<CommunityPost[]>([]);
  public posts$ = this.postsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Carregar posts da comunidade
  loadPosts(page: number = 1, limit: number = 20): Observable<{ posts: CommunityPost[], total: number }> {
    return this.http.get<{ posts: CommunityPost[], total: number }>(`${this.apiUrl}?page=${page}&limit=${limit}`).pipe(
      tap(data => this.postsSubject.next(data.posts))
    );
  }

  // Criar post
  createPost(content: string, mediaType?: 'movie' | 'series', mediaId?: number, mediaTitle?: string): Observable<CommunityPost> {
    return this.http.post<CommunityPost>(this.apiUrl, {
      content,
      mediaType,
      mediaId,
      mediaTitle
    }).pipe(
      tap(post => {
        const current = this.postsSubject.value;
        this.postsSubject.next([post, ...current]);
      })
    );
  }

  // Deletar post
  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`).pipe(
      tap(() => {
        const current = this.postsSubject.value;
        this.postsSubject.next(current.filter(p => p.id !== postId));
      })
    );
  }

  // Dar like em post
  likePost(postId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/like`, {});
  }

  // Remover like de post
  unlikePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/like`);
  }

  // Obter posts de um usuário
  getUserPosts(userId: string): Observable<CommunityPost[]> {
    return this.http.get<CommunityPost[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Obter posts sobre uma mídia específica
  getMediaPosts(mediaType: 'movie' | 'series', mediaId: number): Observable<CommunityPost[]> {
    return this.http.get<CommunityPost[]>(`${this.apiUrl}/media/${mediaType}/${mediaId}`);
  }
}
