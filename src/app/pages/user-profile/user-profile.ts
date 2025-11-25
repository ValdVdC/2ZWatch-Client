import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../features/account/services/profile.service';
import { environment } from '../../../environments/environment';

interface PublicProfile {
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  memberSince: Date;
  stats: {
    totalFavorites: number;
    totalWatchlist: number;
    totalWatchTime: number;
  };
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  profile: PublicProfile | null = null;
  isLoading = true;
  error: string | null = null;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.loadPublicProfile();
      }
    });
  }

  loadPublicProfile(): void {
    this.isLoading = true;
    this.error = null;
    
    this.profileService.getPublicProfile(this.username).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.error = error.error?.error || 'Usuário não encontrado';
        this.isLoading = false;
      }
    });
  }

  getAvatarUrl(): string {
    if (!this.profile?.avatar) {
      return 'assets/placeholders/person.png';
    }

    if (this.profile.avatar.startsWith('http')) {
      return this.profile.avatar;
    }

    return `${environment.api.serverUrl}${this.profile.avatar}`;
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

  goBack(): void {
    this.router.navigate(['/']);
  }
}
