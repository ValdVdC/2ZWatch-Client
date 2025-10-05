import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { PaginatedResponse } from '../../../../shared/models/common.model';

@Component({
  selector: 'app-movie-list',
  standalone: false,
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})
export class MovieList {
  @Input() movies: Movie[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() cardSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() showGenres: boolean = false;
  @Input() showPagination: boolean = true;
  @Input() paginationData?: PaginatedResponse<Movie>;
  
  @Output() movieClick = new EventEmitter<Movie>();
  @Output() addToWatchlist = new EventEmitter<Movie>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();

  get hasMovies(): boolean {
    return this.movies && this.movies.length > 0;
  }

  get emptyMessage(): string {
    if (this.loading) return '';
    return this.error || 'Nenhum filme encontrado';
  }

  get gridColumns(): string {
    switch (this.cardSize) {
      case 'small': return 'repeat(auto-fill, minmax(150px, 1fr))';
      case 'medium': return 'repeat(auto-fill, minmax(200px, 1fr))';
      case 'large': return 'repeat(auto-fill, minmax(280px, 1fr))';
      default: return 'repeat(auto-fill, minmax(200px, 1fr))';
    }
  }

  onMovieClick(movie: Movie): void {
    this.movieClick.emit(movie);
  }

  onAddToWatchlist(movie: Movie): void {
    this.addToWatchlist.emit(movie);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  toggleViewMode(): void {
    const newMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.viewModeChange.emit(newMode);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
