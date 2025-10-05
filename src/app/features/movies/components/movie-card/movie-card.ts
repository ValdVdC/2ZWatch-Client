import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: false,
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCard {
  @Input() movie!: Movie;
  @Input() showGenres: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() movieClick = new EventEmitter<Movie>();
  @Output() addToWatchlist = new EventEmitter<Movie>();

  imageLoaded = false;

  get posterUrl(): string {
    if (!this.movie.poster_path) return '/assets/placeholder-movie.jpg';
    const size = this.size === 'small' ? 'w342' : this.size === 'medium' ? 'w500' : 'w780';
    return `https://image.tmdb.org/t/p/${size}${this.movie.poster_path}`;
  }

  get releaseYear(): string {
    if (!this.movie.release_date) return '';
    return new Date(this.movie.release_date).getFullYear().toString();
  }

  get rating(): string {
    return (this.movie.vote_average || 0).toFixed(1);
  }

  get ratingClass(): string {
    const rating = this.movie.vote_average || 0;
    if (rating >= 8) return 'rating-excellent';
    if (rating >= 7) return 'rating-good';
    if (rating >= 6) return 'rating-average';
    return 'rating-poor';
  }

  onMovieClick(): void {
    this.movieClick.emit(this.movie);
  }

  onAddToWatchlist(event: Event): void {
    event.stopPropagation();
    this.addToWatchlist.emit(this.movie);
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/placeholder-movie.jpg';
    this.imageLoaded = true;
  }
}
