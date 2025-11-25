import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChatMessage, ChatRoom } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.api.baseUrl}/chat`;
  private roomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  public rooms$ = this.roomsSubject.asObservable();
  
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Carregar salas de chat
  loadRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${this.apiUrl}/rooms`).pipe(
      tap(rooms => this.roomsSubject.next(rooms))
    );
  }

  // Criar sala de chat direta
  createDirectRoom(userId: string): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.apiUrl}/rooms/direct`, { userId }).pipe(
      tap(room => {
        const current = this.roomsSubject.value;
        this.roomsSubject.next([...current, room]);
      })
    );
  }

  // Criar sala de grupo
  createGroupRoom(name: string, participants: string[]): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.apiUrl}/rooms/group`, { name, participants }).pipe(
      tap(room => {
        const current = this.roomsSubject.value;
        this.roomsSubject.next([...current, room]);
      })
    );
  }

  // Carregar mensagens de uma sala
  loadMessages(roomId: string, page: number = 1, limit: number = 50): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/rooms/${roomId}/messages?page=${page}&limit=${limit}`).pipe(
      tap(messages => this.messagesSubject.next(messages))
    );
  }

  // Enviar mensagem
  sendMessage(roomId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/rooms/${roomId}/messages`, {
      content,
      type
    }).pipe(
      tap(message => {
        const current = this.messagesSubject.value;
        this.messagesSubject.next([...current, message]);
      })
    );
  }

  // Marcar mensagens como lidas
  markAsRead(roomId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/rooms/${roomId}/read`, {});
  }

  // Deletar mensagem
  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/messages/${messageId}`).pipe(
      tap(() => {
        const current = this.messagesSubject.value;
        this.messagesSubject.next(current.filter(m => m.id !== messageId));
      })
    );
  }

  // Sair de uma sala
  leaveRoom(roomId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rooms/${roomId}/leave`).pipe(
      tap(() => {
        const current = this.roomsSubject.value;
        this.roomsSubject.next(current.filter(r => r.id !== roomId));
      })
    );
  }
}
