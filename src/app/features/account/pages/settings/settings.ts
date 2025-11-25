import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { UserPreferences } from '../../models/account.model';
import { DeleteAccountModalComponent } from '../../../../shared/components/delete-account-modal/delete-account-modal';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteAccountModalComponent],
  template: `
    <!-- Delete Account Modal -->
    <app-delete-account-modal
      [isOpen]="showDeleteModal"
      (confirm)="confirmDeleteAccount($event)"
      (cancel)="cancelDeleteAccount()"
    ></app-delete-account-modal>

    <div class="settings-page">
      <div class="settings-container">
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">
              <i class="bi bi-gear-fill"></i>
              Configurações
            </h1>
            <p class="page-subtitle">Personalize sua experiência no 2ZWatch</p>
          </div>
        </div>

        <!-- Appearance Section -->
        <div class="settings-card">
          <div class="card-header">
            <i class="bi bi-palette-fill header-icon"></i>
            <h2 class="card-title">Aparência</h2>
          </div>
          <div class="card-body">
            <div class="setting-item theme-selector">
              <label class="setting-label">Tema</label>
              <p class="setting-description">Escolha como deseja visualizar o site</p>
              <div class="theme-options">
                <div class="theme-option" [class.active]="theme === 'light'" (click)="selectTheme('light')">
                  <i class="bi bi-sun-fill theme-icon"></i>
                  <span class="theme-name">Claro</span>
                  <i class="bi bi-check-circle-fill check-icon"></i>
                </div>
                <div class="theme-option" [class.active]="theme === 'dark'" (click)="selectTheme('dark')">
                  <i class="bi bi-moon-stars-fill theme-icon"></i>
                  <span class="theme-name">Escuro</span>
                  <i class="bi bi-check-circle-fill check-icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="settings-card">
          <div class="card-header">
            <i class="bi bi-bell-fill header-icon"></i>
            <h2 class="card-title">Notificações</h2>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div class="toggle-item">
                <div class="toggle-content">
                  <label class="setting-label">Notificações por E-mail</label>
                  <p class="setting-description">Receba atualizações importantes por e-mail</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="preferences.notifications.email" (change)="savePreferences()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="toggle-item">
                <div class="toggle-content">
                  <label class="setting-label">Novos Lançamentos</label>
                  <p class="setting-description">Seja notificado sobre novos filmes e séries</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="preferences.notifications.newReleases" (change)="savePreferences()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="toggle-item">
                <div class="toggle-content">
                  <label class="setting-label">Recomendações</label>
                  <p class="setting-description">Receba sugestões personalizadas baseadas no seu gosto</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="preferences.notifications.recommendations" (change)="savePreferences()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Section -->
        <div class="settings-card">
          <div class="card-header">
            <i class="bi bi-shield-lock-fill header-icon"></i>
            <h2 class="card-title">Privacidade</h2>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div class="toggle-item">
                <div class="toggle-content">
                  <label class="setting-label">Perfil Público</label>
                  <p class="setting-description">Permite que outros usuários vejam seu perfil</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="preferences.privacy.showProfile" (change)="savePreferences()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="toggle-item">
                <div class="toggle-content">
                  <label class="setting-label">Watchlist Visível</label>
                  <p class="setting-description">Mostre sua lista "Assistir Depois" para outros</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="preferences.privacy.showWatchlist" (change)="savePreferences()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="toggle-item">
                <div class="toggle-content">
                  <label class="setting-label">Favoritos Visíveis</label>
                  <p class="setting-description">Compartilhe seus filmes e séries favoritos</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="preferences.privacy.showFavorites" (change)="savePreferences()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="settings-card danger-card">
          <div class="card-header">
            <i class="bi bi-exclamation-triangle-fill header-icon"></i>
            <h2 class="card-title">Zona de Perigo</h2>
          </div>
          <div class="card-body">
            <div class="danger-content">
              <div class="danger-info">
                <h3>Deletar Conta</h3>
                <p>Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.</p>
              </div>
              <button (click)="deleteAccount()" class="danger-btn">
                <i class="bi bi-trash-fill"></i>
                Deletar Minha Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===== SETTINGS PAGE ===== */
    .settings-page {
      min-height: 100vh;
      background: var(--bg-primary);
      padding-top: 6rem;
    }

    .settings-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem 4rem;
    }

    /* ===== PAGE HEADER ===== */
    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      text-align: center;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .page-title i {
      font-size: 2rem;
    }

    .page-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin: 0;
    }

    /* ===== SETTINGS CARD ===== */
    .settings-card {
      background: linear-gradient(135deg, 
        rgba(var(--primary-rgb), 0.05) 0%, 
        rgba(var(--secondary-rgb), 0.05) 100%);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      margin-bottom: 1.5rem;
      overflow: hidden;
      box-shadow: var(--shadow-medium);
      transition: all 0.3s ease;
    }

    .settings-card:hover {
      box-shadow: var(--shadow-large);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
      background: rgba(var(--primary-rgb), 0.03);
    }

    .header-icon {
      font-size: 1.75rem;
      color: var(--primary-color);
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .card-body {
      padding: 2rem;
    }

    /* ===== SETTING ITEMS ===== */
    .setting-item {
      margin-bottom: 2rem;
    }

    .setting-item:last-child {
      margin-bottom: 0;
    }

    .setting-label {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
      display: block;
    }

    .setting-description {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    /* ===== THEME SELECTOR ===== */
    .theme-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .theme-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .theme-option:hover {
      border-color: var(--primary-color);
      transform: translateY(-3px);
      box-shadow: var(--shadow-medium);
    }

    .theme-option.active {
      border-color: var(--primary-color);
      background: linear-gradient(135deg, 
        rgba(var(--primary-rgb), 0.1) 0%, 
        rgba(var(--secondary-rgb), 0.1) 100%);
    }

    .theme-icon {
      font-size: 2.5rem;
      color: var(--primary-color);
    }

    .theme-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 1.1rem;
    }

    .check-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      color: var(--primary-color);
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease;
    }

    .theme-option.active .check-icon {
      opacity: 1;
      transform: scale(1);
    }

    /* ===== TOGGLE ITEMS ===== */
    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .toggle-item:hover {
      background: var(--bg-tertiary);
    }

    .toggle-content {
      flex: 1;
    }

    /* ===== TOGGLE SWITCH ===== */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 56px;
      height: 30px;
      flex-shrink: 0;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--bg-quaternary);
      transition: 0.4s;
      border-radius: 30px;
      border: 2px solid var(--border-color);
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-color: var(--primary-color);
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .slider:hover {
      box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
    }

    /* ===== DANGER ZONE ===== */
    .danger-card {
      border-color: var(--error-color);
      background: linear-gradient(135deg, 
        rgba(239, 68, 68, 0.05) 0%, 
        rgba(220, 38, 38, 0.05) 100%);
    }

    .danger-card .card-header {
      background: rgba(239, 68, 68, 0.1);
      border-bottom-color: var(--error-color);
    }

    .danger-card .header-icon {
      color: var(--error-color);
    }

    .danger-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .danger-info h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .danger-info p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .danger-btn {
      padding: 0.875rem 1.75rem;
      background: var(--error-color);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    .danger-btn:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }

    .danger-btn i {
      font-size: 1.1rem;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .settings-page {
        padding-top: 5rem;
      }

      .settings-container {
        padding: 1rem;
      }

      .page-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 0.5rem;
      }

      .card-header,
      .card-body {
        padding: 1.5rem;
      }

      .toggle-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .danger-content {
        flex-direction: column;
        align-items: stretch;
      }

      .danger-btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .theme-options {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  theme: 'light' | 'dark' = 'dark';
  showDeleteModal = false;
  preferences: UserPreferences = {
    theme: 'dark',
    language: 'pt-BR',
    notifications: {
      email: true,
      push: false,
      newReleases: true,
      recommendations: true
    },
    privacy: {
      showProfile: true,
      showWatchlist: true,
      showFavorites: true
    }
  };

  constructor(
    private profileService: ProfileService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.currentThemeValue;
  }

  selectTheme(newTheme: 'light' | 'dark'): void {
    this.theme = newTheme;
    this.onThemeChange();
  }

  onThemeChange(): void {
    this.themeService.setTheme(this.theme);
    this.preferences.theme = this.theme;
    this.savePreferences();
  }

  savePreferences(): void {
    this.profileService.updatePreferences(this.preferences).subscribe({
      error: (err) => console.error('Erro ao salvar preferências:', err)
    });
  }

  deleteAccount(): void {
    this.showDeleteModal = true;
  }

  confirmDeleteAccount(password: string): void {
    this.profileService.deleteAccount(password).subscribe({
      next: () => {
        alert('Conta deletada com sucesso');
        window.location.href = '/';
      },
      error: (err) => {
        alert('Erro ao deletar conta: ' + (err.error?.error || 'Senha incorreta'));
        this.showDeleteModal = false;
      }
    });
  }

  cancelDeleteAccount(): void {
    this.showDeleteModal = false;
  }
}
