import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { 
  User, 
  AuthResponse, 
  RegisterData, 
  LoginData, 
  UpdateProfileData,
  ChangePasswordData 
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.api.baseUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar token ao inicializar
    if (this.hasToken() && !this.currentUserSubject.value) {
      this.loadProfile();
    }
  }

  // Registrar novo usuário
  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Login
  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  // Logout
  logout(): void {
    // Chamar API (opcional)
    if (this.hasToken()) {
      this.http.post(`${this.API_URL}/logout`, {}).subscribe({
        error: (err) => console.error('Erro no logout:', err)
      });
    }

    // Limpar dados locais
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  // Carregar perfil do usuário
  loadProfile(): void {
    this.http.get<{ user: User }>(`${this.API_URL}/profile`)
      .subscribe({
        next: (response) => {
          this.setUser(response.user);
        },
        error: (err) => {
          console.error('Erro ao carregar perfil:', err);
          this.clearAuthData();
        }
      });
  }

  // Atualizar perfil
  updateProfile(data: UpdateProfileData): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.API_URL}/profile`, data)
      .pipe(
        tap(response => this.setUser(response.user))
      );
  }

  // Alterar senha
  changePassword(data: ChangePasswordData): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API_URL}/change-password`, data);
  }

  // Obter perfil do usuário (para OAuth callback)
  getProfile(): Observable<User> {
    return this.http.get<{ user: User }>(`${this.API_URL}/profile`)
      .pipe(
        map(response => {
          return response.user;
        })
      );
  }

  // Definir usuário atual (para OAuth callback)
  setCurrentUser(user: User): void {
    this.setUser(user);
  }

  // Obter token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verificar se tem token
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.hasToken() && !!this.currentUserSubject.value;
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar se é admin
  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  // Verificar se é moderador ou admin
  isModerator(): boolean {
    const role = this.currentUserSubject.value?.role;
    return role === 'moderator' || role === 'admin';
  }

  // Handlers privados
  private handleAuthSuccess(response: AuthResponse): void {
    this.setToken(response.token);
    this.setUser(response.user);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSubject.next(true);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
