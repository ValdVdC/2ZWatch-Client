import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SeriesDetail } from '../../models/series.model';

@Component({
  selector: 'app-series-details',
  standalone: false,
  templateUrl: './series-details.html',
  styleUrl: './series-details.css'
})
export class SeriesDetails {
  @Input() series!: SeriesDetail;
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  @Output() addToWatchlist = new EventEmitter<SeriesDetail>();
  @Output() shareSeries = new EventEmitter<SeriesDetail>();
  @Output() playTrailer = new EventEmitter<SeriesDetail>();

  activeTab: 'overview' | 'cast' | 'videos' | 'images' = 'overview';
  showFullOverview = false;

  get backdropUrl(): string {
    if (!this.series?.backdrop_path) return '';
    return `https://image.tmdb.org/t/p/w1280${this.series.backdrop_path}`;
  }

  get posterUrl(): string {
    if (!this.series?.poster_path) return '/assets/placeholder-series.jpg';
    return `https://image.tmdb.org/t/p/w500${this.series.poster_path}`;
  }

  get releaseYear(): string {
    if (!this.series?.first_air_date) return '';
    return new Date(this.series.first_air_date).getFullYear().toString();
  }

  // get runtime(): string {
  //   if (!this.series?.runtime) return '';
  //   const hours = Math.floor(this.series.runtime / 60);
  //   const minutes = this.series.runtime % 60;
  //   return `${hours}h ${minutes}min`;
  // }

  get rating(): string {
    return (this.series?.vote_average || 0).toFixed(1);
  }

  get ratingPercentage(): number {
    return Math.round((this.series?.vote_average || 0) * 10);
  }

  // get budget(): string {
  //   if (!this.series?.budget) return '';
  //   return new Intl.NumberFormat('pt-BR', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 0
  //   }).format(this.series.budget);
  // }

  // get revenue(): string {
  //   if (!this.series?.revenue) return '';
  //   return new Intl.NumberFormat('pt-BR', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 0
  //   }).format(this.series.revenue);
  // }

  get hasTrailer(): boolean {
    return !!(this.series?.videos?.length);
  }

  get mainGenres(): string[] {
    return this.series?.genres?.slice(0, 3) || [];
  }

  get directors(): string[] {
    return this.series?.credits?.crew
      ?.filter(member => member.job === 'Director')
      ?.map(director => director.name) || [];
  }

  get writers(): string[] {
    return this.series?.credits?.crew
      ?.filter(member => ['Writer', 'Screenplay', 'Story'].includes(member.job))
      ?.map(writer => writer.name)
      ?.slice(0, 3) || [];
  }

  get mainCast(): any[] {
    return this.series?.credits?.cast?.slice(0, 8) || [];
  }

  setActiveTab(tab: 'overview' | 'cast' | 'videos' | 'images'): void {
    this.activeTab = tab;
  }

  toggleOverview(): void {
    this.showFullOverview = !this.showFullOverview;
  }

  onAddToWatchlist(): void {
    this.addToWatchlist.emit(this.series);
  }

  onShare(): void {
    this.shareSeries.emit(this.series);
  }

  onPlayTrailer(): void {
    this.playTrailer.emit(this.series);
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}
