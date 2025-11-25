import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../.././../features/account/services/favorites.service';
import { WatchlistService } from '../.././../features/account/services/watchlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-media-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-actions.html',
  styleUrls: ['./media-actions.css']
})
export class MediaActionsComponent implements OnInit, OnChanges {
  @Input() mediaType: 'movie' | 'series' = 'movie';
  @Input() mediaId!: number;
  @Input() title!: string;
  @Input() posterPath?: string;
  @Input() rating?: number;

  isFavorite = false;
  isInWatchlist = false;
  isLoadingFavorite = false;
  isLoadingWatchlist = false;
  isAuthenticated = false;

  constructor(
    private favoritesService: FavoritesService,
    private watchlistService: WatchlistService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inscrever-se no estado de autenticação
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      if (auth && this.mediaId) {
        this.checkStatus();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verificar status quando o mediaId mudar
    if (changes['mediaId'] && !changes['mediaId'].firstChange && this.isAuthenticated) {
      this.checkStatus();
    }
  }

  checkStatus(): void {
    if (!this.mediaId) return;

    this.favoritesService.isFavorite(this.mediaType, this.mediaId).subscribe({
      next: (result) => this.isFavorite = result,
      error: (err) => console.error('Erro ao verificar favorito:', err)
    });

    this.watchlistService.isInWatchlist(this.mediaType, this.mediaId).subscribe({
      next: (result) => this.isInWatchlist = result,
      error: (err) => console.error('Erro ao verificar watchlist:', err)
    });
  }

  toggleFavorite(): void {
    if (!this.isAuthenticated) {
      this.goToLogin();
      return;
    }

    this.isLoadingFavorite = true;

    if (this.isFavorite) {
      // Remover usando o novo método direto
      this.favoritesService.removeFromFavoritesByMedia(this.mediaType, this.mediaId).subscribe({
        next: () => {
          this.isFavorite = false;
          this.isLoadingFavorite = false;
        },
        error: (err) => {
          console.error('Erro ao remover favorito:', err);
          this.isLoadingFavorite = false;
        }
      });
    } else {
      // Adicionar
      this.favoritesService.addToFavorites(
        this.mediaType,
        this.mediaId,
        this.title,
        this.posterPath
      ).subscribe({
        next: () => {
          this.isFavorite = true;
          this.isLoadingFavorite = false;
        },
        error: (err) => {
          console.error('Erro ao adicionar favorito:', err);
          this.isLoadingFavorite = false;
        }
      });
    }
  }

  toggleWatchlist(): void {
    if (!this.isAuthenticated) {
      this.goToLogin();
      return;
    }

    this.isLoadingWatchlist = true;

    if (this.isInWatchlist) {
      // Remover usando o novo método direto
      this.watchlistService.removeFromWatchlistByMedia(this.mediaType, this.mediaId).subscribe({
        next: () => {
          this.isInWatchlist = false;
          this.isLoadingWatchlist = false;
        },
        error: (err) => {
          console.error('Erro ao remover da watchlist:', err);
          this.isLoadingWatchlist = false;
        }
      });
    } else {
      // Adicionar
      this.watchlistService.addToWatchlist(
        this.mediaType,
        this.mediaId,
        this.title,
        this.posterPath,
        'medium'
      ).subscribe({
        next: () => {
          this.isInWatchlist = true;
          this.isLoadingWatchlist = false;
        },
        error: (err) => {
          console.error('Erro ao adicionar à watchlist:', err);
          this.isLoadingWatchlist = false;
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}
