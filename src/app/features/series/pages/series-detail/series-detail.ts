import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
// import { Video } from '../../../movies/models/movie.model';
import { Subscription } from 'rxjs';
import { SeriesDetail as SeriesDetailModel, Season } from '../../models/series.model';
import { SeriesService } from '../../services/series.service';
import { Collection, Video } from '../../../movies/models/movie.model';

@Component({
  selector: 'app-series-detail',
  standalone: false,
  templateUrl: './series-detail.html',
  styleUrl: './series-detail.css'
})
export class SeriesDetail implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  series: SeriesDetailModel | null = null;
  loading = false;
  error: string | null = null;
  activeTab: 'details' | 'cast' | 'videos' | 'images' | 'similar' | 'seasons' = 'details';
  showFullOverview = false;
  selectedSeason: Season | null = null;
  isVideoModalOpen = false;
  selectedVideoKey = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private seriesService: SeriesService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToRoute(): void {
    const routeSubscription = this.route.data.subscribe(data => {
      if (data['series']) {
        this.series = data['series'];
        this.error = null;
      } else {
        this.error = 'Filme não encontrado';
        this.series = null;
      }
    });

    const paramSubscription = this.route.params.subscribe(params => {
      if (params['id'] && !this.series) {
        this.loadSeriesDetails(Number(params['id']));
      }
    });

    this.subscriptions.push(routeSubscription, paramSubscription);
  }

  private loadSeriesDetails(seriesId: number): void {
    this.loading = true;
    this.error = null;

    const subscription = this.seriesService.getSeriesDetails(seriesId).subscribe({
      next: (series) => {
        this.series = series;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar detalhes do filme';
        this.loading = false;
        console.error('Error loading series details:', error);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Getters for computed properties
  get backdropUrl(): string {
    if (!this.series?.backdrop_path && !this.series?.backdrop_url) return '';
    return this.series.backdrop_url || `https://image.tmdb.org/t/p/w1280${this.series.backdrop_path}`;
  }

  get posterUrl(): string | null {
    if (!this.series?.poster_path && !this.series?.poster_url) return null;
    return this.series.poster_url || `https://image.tmdb.org/t/p/w500${this.series.poster_path}`;
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

  get ratingClass(): string {
    const rating = this.series?.vote_average || 0;
    if (rating >= 8) return 'excellent';
    if (rating >= 7) return 'good';
    if (rating >= 6) return 'average';
    return 'poor';
  }

  get hasTrailer(): boolean {
    return !!(this.series?.videos?.some(video => 
      video.type.toLowerCase().includes('trailer')
    ));
  }

  get directors(): string[] {
    return this.series?.credits?.crew
      ?.filter(member => member.job === 'Director')
      ?.map(director => director.name) || [];
  }

  get writers(): string[] {
    const jobs = ['Writer', 'Screenplay', 'Story'];
    return this.series?.credits?.crew
      ?.filter(member => jobs.includes(member.job))
      ?.map(writer => writer.name)
      ?.slice(0, 3) || [];
  }

  get mainCast(): any[] {
    return this.series?.credits?.cast?.slice(0, 12) || [];
  }

  get hasImages(): boolean {
    return !!(
      (this.series?.images?.backdrops?.length) ||
      (this.series?.images?.posters?.length)
    );
  }

  // Event handlers
  goBack(): void {
    this.location.back();
  }

  retry(): void {
    const seriesId = Number(this.route.snapshot.params['id']);
    if (seriesId) {
      this.loadSeriesDetails(seriesId);
    }
  }

  setActiveTab(tab: 'details' | 'cast' | 'videos' | 'images' | 'similar' | 'seasons'): void {
    this.activeTab = tab;
  }

  toggleOverview(): void {
    this.showFullOverview = !this.showFullOverview;
  }

  onAddToWatchlist(): void {
    if (!this.series) return;
    
    // TODO: Implement actual watchlist functionality
    this.errorHandler.showSuccess(`${this.series.name} adicionado aos favoritos!`);
  }

  onShare(): void {
    if (!this.series) return;

    const shareData = {
      title: this.series.name,
      text: this.series.overview || `Confira ${this.series.name}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.errorHandler.showSuccess('Link copiado para a área de transferência!');
      }).catch(() => {
        this.errorHandler.handleError('Não foi possível copiar o link.');
      });
    }
  }

    onPlayTrailer(): void {
      if (!this.series?.videos?.length) return;

      const trailer = this.series.videos.find(video => 
        video.type.toLowerCase().includes('trailer')
      ) || this.series.videos[0];

      this.playVideo(trailer);
    }

    playVideo(video: Video): void {
      // Extract video key from URL or use key directly
      this.selectedVideoKey = video.key;
      this.isVideoModalOpen = true;
    }

    closeVideoModal(): void {
      this.isVideoModalOpen = false;
      this.selectedVideoKey = '';
    }

  viewSeries(seriesId: number): void {
    this.router.navigate(['/series', seriesId]);
  }

  viewSeason(seriesId: number, seasonNumber: number): void {
    this.router.navigate(['/series', seriesId, 'season', seasonNumber]);
  }

  viewEpisode(seriesId: number, seasonNumber: number, episodeNumber: number): void {
    this.router.navigate(['/series', seriesId, 'season', seasonNumber, 'episode', episodeNumber]);
  }

  viewPerson(personId: number): void {
    // TODO: Navigate to person details page when implemented
    console.log('View person:', personId);
  }

    viewCollection(collection: Collection): void {
      // TODO: Navigate to collection page when implemented
      console.log('View collection:', collection);
    }

  openLightbox(imageUrl: string): void {
    // TODO: Implement image lightbox/modal
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  }

  // Utility methods
  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatVoteCount(count: number): string {
    if (!count) return '0';
    
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    
    return count.toString();
  }

    getCollectionPoster(collection: Collection): string | null {
      if (!collection.poster_path) return null;
      return `https://image.tmdb.org/t/p/w185${collection.poster_path}`;
    }

  getSimilarSeriesPoster(series: any): string | null {
    if (!series?.poster_path && !series?.poster_url) return null;
    return series.poster_url || `https://image.tmdb.org/t/p/w185${series.poster_path}`;
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  getYoutubeThumbnail(videoKey: string): string {
    return `https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`;
  }

  getVideoTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'Trailer': 'Trailer',
      'Teaser': 'Teaser',
      'Clip': 'Clipe',
      'Behind the Scenes': 'Bastidores',
      'Bloopers': 'Erros de Gravação',
      'Featurette': 'Making Of'
    };

    return typeMap[type] || type;
  }

  getSeasonPoster(season: Season): string | null {
    if (season.poster_url) return season.poster_url;
    if (season.poster_path) return `https://image.tmdb.org/t/p/w300${season.poster_path}`;
    return null;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
