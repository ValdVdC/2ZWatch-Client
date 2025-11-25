import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserProfile, UserStats } from '../../models/account.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  stats: UserStats | null = null;
  isEditing = false;
  isLoading = true;
  error: string | null = null;
  
  // Dados editáveis
  editData = {
    username: '',
    bio: ''
  };

  // Upload de avatar
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadStats();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.loadProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.editData = {
          username: profile.username,
          bio: profile.bio || ''
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.error = 'Não foi possível carregar o perfil';
        this.isLoading = false;
      }
    });
  }

  loadStats(): void {
    this.profileService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      // Cancelar edição
      if (this.profile) {
        this.editData = {
          username: this.profile.username,
          bio: this.profile.bio || ''
        };
      }
      this.selectedFile = null;
      this.previewUrl = null;
    }
    this.isEditing = !this.isEditing;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async saveProfile(): Promise<void> {
    if (!this.profile) return;

    try {
      // Upload de avatar se selecionado
      if (this.selectedFile) {
        const result = await this.profileService.uploadAvatar(this.selectedFile).toPromise();
        if (result) {
          this.profile.avatar = result.avatarUrl;
          
          // Atualizar o usuário atual no AuthService para refletir no header
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            this.authService.setCurrentUser({
              ...currentUser,
              avatar: result.avatarUrl
            });
          }
        }
      }

      // Atualizar dados do perfil
      const updates: Partial<UserProfile> = {
        username: this.editData.username,
        bio: this.editData.bio
      };

      this.profileService.updateProfile(updates).subscribe({
        next: (updated) => {
          this.profile = updated;
          this.isEditing = false;
          this.selectedFile = null;
          this.previewUrl = null;
        },
        error: (error) => {
          console.error('Erro ao atualizar perfil:', error);
          this.error = 'Não foi possível atualizar o perfil';
        }
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      this.error = 'Ocorreu um erro ao salvar';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatWatchTime(minutes: number): string {
    if (!minutes || minutes === 0) return '0h';
    
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Obtém a URL completa do avatar do usuário
   * - Se for URL do Google (começa com http), retorna como está
   * - Se for caminho relativo, constrói URL completa com serverUrl
   * - Se não houver avatar, retorna placeholder
   */
  getAvatarUrl(): string {
    const avatar = this.previewUrl || this.profile?.avatar;
    
    if (!avatar) {
      return 'assets/placeholders/person.png';
    }

    // Se é preview local ou URL completa (Google, etc), retorna como está
    if (avatar.startsWith('data:') || avatar.startsWith('http')) {
      return avatar;
    }

    // Se é caminho relativo, constrói URL completa
    return `${environment.api.serverUrl}${avatar}`;
  }
}
