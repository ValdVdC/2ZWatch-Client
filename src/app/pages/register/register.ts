import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterData } from '../../core/models/auth.model';
import { PasswordValidator } from '../../shared/validators/password-validator';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerData: RegisterData = {
    username: '',
    email: '',
    password: '',
    displayName: ''
  };

  confirmPassword = '';
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirecionar se já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  loginWithGoogle(): void {
    // Redireciona para a rota de autenticação OAuth do backend
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erro no registro:', error);
        this.errorMessage = error.error?.error || 'Erro ao criar conta. Tente novamente.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    // Username
    if (!this.registerData.username.trim()) {
      this.errorMessage = 'Nome de usuário é obrigatório';
      return false;
    }

    if (this.registerData.username.length < 3 || this.registerData.username.length > 30) {
      this.errorMessage = 'Nome de usuário deve ter entre 3 e 30 caracteres';
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(this.registerData.username)) {
      this.errorMessage = 'Nome de usuário deve conter apenas letras, números e underscore';
      return false;
    }

    // Email
    if (!this.registerData.email.trim()) {
      this.errorMessage = 'Email é obrigatório';
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(this.registerData.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    // Senha
    if (!this.registerData.password) {
      this.errorMessage = 'Senha é obrigatória';
      return false;
    }

    if (this.registerData.password.length < 8) {
      this.errorMessage = 'Senha deve ter no mínimo 8 caracteres';
      return false;
    }

    // Validar força da senha
    const passwordStrength = PasswordValidator.validate(this.registerData.password);
    if (passwordStrength.score < 2) {
      this.errorMessage = `Senha muito fraca. ${passwordStrength.feedback[0]}`;
      return false;
    }

    // Confirmar senha
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return false;
    }

    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
