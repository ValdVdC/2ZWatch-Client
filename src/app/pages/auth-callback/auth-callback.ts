import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: false,
  template: `
    <div class="auth-callback">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Autenticando...</span>
      </div>
      <p class="mt-3">Completando autenticação...</p>
    </div>
  `,
  styles: [`
    .auth-callback {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
    }
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
    p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
  `]
})
export class AuthCallback implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        console.error('❌ Erro na autenticação OAuth:', error);
        this.router.navigate(['/login'], { 
          queryParams: { error: 'Erro ao autenticar com Google' } 
        });
        return;
      }

      if (token) {
        
        // Salvar token e atualizar estado de autenticação
        localStorage.setItem('auth_token', token);
        
        // Buscar dados do usuário
        this.authService.getProfile().subscribe({
          next: (user) => {
            this.authService.setCurrentUser(user);
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 500);
          },
          error: (error) => {
            console.error('❌ Erro ao buscar perfil após OAuth:');
            console.error('   Status:', error.status);
            console.error('   Message:', error.message);
            console.error('   Error obj:', error);
            this.router.navigate(['/login'], { 
              queryParams: { error: 'Erro ao carregar perfil' } 
            });
          }
        });
      } else {
        console.warn('⚠️ Nenhum token ou erro fornecido');
        this.router.navigate(['/login']);
      }
    });
  }
}
