import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoggerService } from '../../core/services/logger.service';
import { LoginData } from '../../core/models/auth.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  loginData: LoginData = {
    login: '',
    password: ''
  };

  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // Redirecionar se já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loginWithGoogle(): void {
    // Redireciona para a rota de autenticação OAuth do backend
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.logger.error('Erro no login', error);
        this.errorMessage = error.error?.error || 'Erro ao realizar login. Tente novamente.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.loginData.login.trim()) {
      this.errorMessage = 'Email ou nome de usuário é obrigatório';
      return false;
    }

    if (!this.loginData.password) {
      this.errorMessage = 'Senha é obrigatória';
      return false;
    }

    if (this.loginData.password.length < 6) {
      this.errorMessage = 'Senha deve ter no mínimo 6 caracteres';
      return false;
    }

    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
