import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Collection, Video, MovieDetail as MovieDetailModel, CastMember } from '../../models/movie.model';
import { Subscription } from 'rxjs';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: false,
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css'
})
export class MovieDetail implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  movie: MovieDetailModel | null = null;
  loading = false;
  error: string | null = null;
  activeTab: 'details' | 'cast' | 'videos' | 'images' | 'similar' = 'details';
  showFullOverview = false;
  isVideoModalOpen = false;
  selectedVideoKey = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private movieService: MovieService,
    private errorHandler: ErrorHandlerService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.subscribeToRoute();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private subscribeToRoute(): void {
    const routeSubscription = this.route.data.subscribe(data => {
      if (data['movie']) {
        this.movie = data['movie'];
        this.error = null;
      } else {
        this.error = 'Filme não encontrado';
        this.movie = null;
      }
    });

    const paramSubscription = this.route.params.subscribe(params => {
      if (params['id'] && !this.movie) {
        this.loadMovieDetails(Number(params['id']));
      }
    });

    this.subscriptions.push(routeSubscription, paramSubscription);
  }

  private loadMovieDetails(movieId: number): void {
    this.loading = true;
    this.error = null;

    const subscription = this.movieService.getMovieDetails(movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar detalhes do filme';
        this.loading = false;
        this.logger.error('Error loading movie details', error);
        this.errorHandler.handleError(error, 'Erro ao carregar detalhes do filme');
      }
    });

    this.subscriptions.push(subscription);
  }

  // Getters for computed properties
  get backdropUrl(): string {
    if (!this.movie?.backdrop_path && !this.movie?.backdrop_url) return '';
    return this.movie.backdrop_url || `https://image.tmdb.org/t/p/w1280${this.movie.backdrop_path}`;
  }

  get posterUrl(): string | null {
    if (!this.movie?.poster_path && !this.movie?.poster_url) return null;
    return this.movie.poster_url || `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
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

  get ratingClass(): string {
    const rating = this.movie?.vote_average || 0;
    if (rating >= 8) return 'excellent';
    if (rating >= 7) return 'good';
    if (rating >= 6) return 'average';
    return 'poor';
  }

  get hasTrailer(): boolean {
    return !!(this.movie?.videos?.some(video => 
      video.type.toLowerCase().includes('trailer')
    ));
  }

  get directors(): string[] {
    return this.movie?.credits?.crew
      ?.filter(member => member.job === 'Director')
      ?.map(director => director.name) || [];
  }

  get writers(): string[] {
    const jobs = ['Writer', 'Screenplay', 'Story'];
    return this.movie?.credits?.crew
      ?.filter(member => jobs.includes(member.job))
      ?.map(writer => writer.name)
      ?.slice(0, 3) || [];
  }

  get mainCast(): CastMember[] {
    return this.movie?.credits?.cast?.slice(0, 12) || [];
  }

  get hasImages(): boolean {
    return !!(
      (this.movie?.images?.backdrops?.length) ||
      (this.movie?.images?.posters?.length)
    );
  }

  // Event handlers
  goBack(): void {
    this.location.back();
  }

  retry(): void {
    const movieId = Number(this.route.snapshot.params['id']);
    if (movieId) {
      this.loadMovieDetails(movieId);
    }
  }

  setActiveTab(tab: 'details' | 'cast' | 'videos' | 'images' | 'similar'): void {
    this.activeTab = tab;
  }

  toggleOverview(): void {
    this.showFullOverview = !this.showFullOverview;
  }

  onAddToWatchlist(): void {
    if (!this.movie) return;
    
    // TODO: Implement actual watchlist functionality
    this.errorHandler.showSuccess(`${this.movie.title} adicionado aos favoritos!`);
  }

  onShare(): void {
    if (!this.movie) return;

    const shareData = {
      title: this.movie.title,
      text: this.movie.overview || `Confira ${this.movie.title}`,
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
    if (!this.movie?.videos?.length) return;

    const trailer = this.movie.videos.find(video => 
      video.type.toLowerCase().includes('trailer')
    ) || this.movie.videos[0];

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

  viewMovie(movieId: number): void {
    this.router.navigate(['/movies', movieId]);
  }

  viewPerson(personId: number): void {
    // TODO: Navigate to person details page when implemented
    this.logger.debug('View person:', personId);
  }

  viewCollection(collection: Collection): void {
    // TODO: Navigate to collection page when implemented
    this.logger.debug('View collection:', collection);
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

  getSimilarMoviePoster(movie: { poster_path?: string; poster_url?: string }): string | null {
    if (!movie?.poster_path && !movie?.poster_url) return null;
    return movie.poster_url || `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
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
}
