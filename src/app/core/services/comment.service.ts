import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    displayName?: string;
    avatar?: string;
  };
  mediaType: 'movie' | 'series';
  mediaId: number;
  content: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentsPagination {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.api.baseUrl}/comments`;

  constructor(private http: HttpClient) {}

  // Criar comentário
  createComment(mediaType: 'movie' | 'series', mediaId: number, content: string): Observable<{ message: string; comment: Comment }> {
    return this.http.post<{ message: string; comment: Comment }>(this.apiUrl, {
      mediaType,
      mediaId,
      content
    });
  }

  // Obter comentários
  getComments(mediaType: 'movie' | 'series', mediaId: number, page: number = 1, limit: number = 10): Observable<CommentsPagination> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<CommentsPagination>(`${this.apiUrl}/${mediaType}/${mediaId}`, { params });
  }

  // Atualizar comentário
  updateComment(commentId: string, content: string): Observable<{ message: string; comment: Comment }> {
    return this.http.put<{ message: string; comment: Comment }>(`${this.apiUrl}/${commentId}`, {
      content
    });
  }

  // Deletar comentário
  deleteComment(commentId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${commentId}`);
  }

  // Curtir/descurtir comentário
  toggleLike(commentId: string): Observable<{ message: string; likes: number }> {
    return this.http.post<{ message: string; likes: number }>(`${this.apiUrl}/${commentId}/like`, {});
  }
}
