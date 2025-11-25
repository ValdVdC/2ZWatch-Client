import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { FavoriteItem } from '../../models/account.model';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationModalComponent],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class FavoritesComponent implements OnInit {
  favorites: FavoriteItem[] = [];
  filteredFavorites: FavoriteItem[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Filtros
  filterType: 'all' | 'movie' | 'series' = 'all';
  sortBy: 'date' | 'title' | 'rating' = 'date';

  // Modal
  showModal = false;
  favoriteToRemove: FavoriteItem | null = null;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoritesService.loadFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar favoritos:', error);
        this.error = 'Não foi possível carregar os favoritos';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.favorites];

    // Filtrar por tipo
    if (this.filterType !== 'all') {
      filtered = filtered.filter(f => f.mediaType === this.filterType);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    this.filteredFavorites = filtered;
  }

  onFilterChange(type: 'all' | 'movie' | 'series'): void {
    this.filterType = type;
    this.applyFilters();
  }

  onSortChange(sort: 'date' | 'title' | 'rating'): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  removeFavorite(favorite: FavoriteItem): void {
    this.favoriteToRemove = favorite;
    this.showModal = true;
  }

  confirmRemove(): void {
    if (this.favoriteToRemove) {
      this.favoritesService.removeFromFavoritesByMedia(
        this.favoriteToRemove.mediaType, 
        this.favoriteToRemove.mediaId
      ).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(f => f.id !== this.favoriteToRemove!.id);
          this.applyFilters();
          this.favoriteToRemove = null;
        },
        error: (error) => {
          console.error('Erro ao remover favorito:', error);
          this.favoriteToRemove = null;
        }
      });
    }
  }

  cancelRemove(): void {
    this.favoriteToRemove = null;
    this.showModal = false;
  }

  getImageUrl(posterPath?: string): string {
    if (!posterPath) return 'assets/placeholders/person.png';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  getMediaLink(favorite: FavoriteItem): string {
    return `/${favorite.mediaType === 'movie' ? 'movies' : 'series'}/${favorite.mediaId}`;
  }

  getCountByType(type: 'all' | 'movie' | 'series'): number {
    if (type === 'all') return this.favorites.length;
    return this.favorites.filter(f => f.mediaType === type).length;
  }
}
