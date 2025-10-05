import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieDetail } from '../../models/movie.model';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails {
  @Input() movie!: MovieDetail;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  @Output() addToWatchlist = new EventEmitter<MovieDetail>();
  @Output() shareMovie = new EventEmitter<MovieDetail>();
  @Output() playTrailer = new EventEmitter<MovieDetail>();

  activeTab: 'overview' | 'cast' | 'videos' | 'images' = 'overview';
  showFullOverview = false;

  get backdropUrl(): string {
    if (!this.movie?.backdrop_path) return '';
    return `https://image.tmdb.org/t/p/w1280${this.movie.backdrop_path}`;
  }

  get posterUrl(): string {
    if (!this.movie?.poster_path) return '/assets/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
  }

  get releaseYear(): string {
    if (!this.movie?.release_date) return '';
    return new Date(this.movie.release_date).getFullYear().toString();
  }

  get runtime(): string {
    if (!this.movie?.runtime) return '';
    const hours = Math.floor(this.movie.runtime / 60);
    const minutes = this.movie.runtime % 60;
    return `${hours}h ${minutes}min`;
  }

  get rating(): string {
    return (this.movie?.vote_average || 0).toFixed(1);
  }

  get ratingPercentage(): number {
    return Math.round((this.movie?.vote_average || 0) * 10);
  }

  get budget(): string {
    if (!this.movie?.budget) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(this.movie.budget);
  }

  get revenue(): string {
    if (!this.movie?.revenue) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(this.movie.revenue);
  }

  get hasTrailer(): boolean {
    return !!(this.movie?.videos?.length);
  }

  get mainGenres(): string[] {
    return this.movie?.genres?.slice(0, 3) || [];
  }

  get directors(): string[] {
    return this.movie?.credits?.crew
      ?.filter(member => member.job === 'Director')
      ?.map(director => director.name) || [];
  }

  get writers(): string[] {
    return this.movie?.credits?.crew
      ?.filter(member => ['Writer', 'Screenplay', 'Story'].includes(member.job))
      ?.map(writer => writer.name)
      ?.slice(0, 3) || [];
  }

  get mainCast(): any[] {
    return this.movie?.credits?.cast?.slice(0, 8) || [];
  }

  setActiveTab(tab: 'overview' | 'cast' | 'videos' | 'images'): void {
    this.activeTab = tab;
  }

  toggleOverview(): void {
    this.showFullOverview = !this.showFullOverview;
  }

  onAddToWatchlist(): void {
    this.addToWatchlist.emit(this.movie);
  }

  onShare(): void {
    this.shareMovie.emit(this.movie);
  }

  onPlayTrailer(): void {
    this.playTrailer.emit(this.movie);
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}
