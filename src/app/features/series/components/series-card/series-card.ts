import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Series } from '../../models/series.model';

@Component({
  selector: 'app-series-card',
  standalone: false,
  templateUrl: './series-card.html',
  styleUrl: './series-card.css'
})
export class SeriesCard {
  @Input() series!: Series;
  @Input() showGenres: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() seriesClick = new EventEmitter<Series>();
  @Output() addToWatchlist = new EventEmitter<Series>();  

  imageLoaded = false;

  get posterUrl(): string {
    if (!this.series.poster_path) return '/assets/placeholder-series.jpg';
    const size = this.size === 'small' ? 'w342' : this.size === 'medium' ? 'w500' : 'w780';
    return `https://image.tmdb.org/t/p/${size}${this.series.poster_path}`
  }

  get releaseYear(): string {
    if (!this.series.first_air_date) return '';
    return new Date(this.series.first_air_date).getFullYear().toString();
  }

  get rating(): string {
    return (this.series.vote_average || 0).toFixed(1);
  }

  get ratingClass(): string {
    const rating = this.series.vote_average || 0;
    if (rating >= 8) return 'rating-excellent';
    if (rating >= 7) return 'rating-good';
    if (rating >= 6) return 'rating-average';
    return 'rating-poor';
  }

  onSeriesClick(): void {
    this.seriesClick.emit(this.series);
  }

  onAddToWatchlist(event: Event): void {
    event.stopPropagation();
    this.addToWatchlist.emit(this.series);
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(event: any): void {
    event.target.src = '/assets/placeholder-series.jpg';
    this.imageLoaded = true;
  }
}
