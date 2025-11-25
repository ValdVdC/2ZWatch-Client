import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { UserProfile, UserPreferences, UserStats } from '../models/account.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.api.baseUrl}/auth/profile`;
  private statsUrl = `${environment.api.baseUrl}/auth/profile/stats`;
  private preferencesUrl = `${environment.api.baseUrl}/auth/profile/preferences`;
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Carregar perfil do usuário
  loadProfile(): Observable<UserProfile> {
    return this.http.get<{ user: UserProfile }>(`${environment.api.baseUrl}/auth/profile`).pipe(
      map(response => response.user),
      tap(profile => this.profileSubject.next(profile))
    );
  }

  // Atualizar perfil
  updateProfile(updates: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<{ user: UserProfile }>(`${environment.api.baseUrl}/auth/profile`, updates).pipe(
      map(response => response.user),
      tap(profile => this.profileSubject.next(profile))
    );
  }

  // Upload de avatar
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>(`${environment.api.baseUrl}/auth/profile/avatar`, formData);
  }

  // Atualizar preferências
  updatePreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    return this.http.patch<UserPreferences>(this.preferencesUrl, preferences);
  }

  // Obter estatísticas
  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(this.statsUrl);
  }

  // Alterar senha
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${environment.api.baseUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  // Deletar conta
  deleteAccount(password: string): Observable<void> {
    return this.http.delete<void>(`${environment.api.baseUrl}/auth/profile`, {
      body: { password }
    });
  }

  // Obter perfil público de outro usuário
  getPublicProfile(username: string): Observable<any> {
    return this.http.get<any>(`${environment.api.baseUrl}/users/${username}`);
  }
}
