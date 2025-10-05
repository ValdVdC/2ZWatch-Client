// movies-home.component.ts
import { Component, OnDestroy, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieFilters } from '../../components/movie-filter/movie-filter';
import { MovieService } from '../../services/movie.service';
import { TaxonomyService } from '../../../taxonomy/services/taxonomy.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-movies-home',
  standalone: false,
  templateUrl: './movies-home.html',
  styleUrl: './movies-home.css'
})
export class MoviesHome implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions: Subscription[] = [];
  private heroSliderInterval?: Subscription;

  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  // Data properties
  featuredMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  nowPlayingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  genres: { id: number; name: string }[] = [];

  // Loading states
  loadingFeatured = false;
  loadingPopular = false;
  loadingNowPlaying = false;
  loadingUpcoming = false;
  loadingTopRated = false;
  loadingGenres = false;

  // Hero slider
  currentSlide = 0;

  // Filter states
  showFilters = false;
  activeFilters: MovieFilters = {};

  constructor(
    private movieService: MovieService,
    private taxonomyService: TaxonomyService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadGenres();
    this.loadAllSections();
  }

  ngAfterViewInit(): void {
    // Start hero slider after view init
    this.startHeroSlider();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.stopHeroSlider();
  }

  // Data loading methods
  private loadGenres(): void {
    this.loadingGenres = true;
    const subscription = this.taxonomyService.getMovieGenres().subscribe({
      next: (genres) => {
        this.genres = Object.entries(genres).map(([id, name]) => ({
          id: Number(id),
          name: name
        }));
        this.loadingGenres = false;
      },
      error: (error) => {
        console.error('Error loading genres:', error);
        this.loadingGenres = false;
      }
    });
    this.subscriptions.push(subscription);
  }

  public loadAllSections(): void {
    this.loadFeaturedMovies();
    this.loadPopularMovies();
    this.loadNowPlayingMovies();
    this.loadUpcomingMovies();
    this.loadTopRatedMovies();
  }

  private loadFeaturedMovies(): void {
    this.loadingFeatured = true;
    const subscription = this.movieService.getPopularMovies({ page: 1, pageSize: 5 })
      .subscribe({
        next: (response) => {
          this.featuredMovies = (response.results || response.movies || []).slice(0, 5);
          this.loadingFeatured = false;
          
          // Start slider if we have movies
          if (this.featuredMovies.length > 1) {
            this.startHeroSlider();
          }
        },
        error: (error) => {
          console.error('Error loading featured movies:', error);
          this.loadingFeatured = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadPopularMovies(): void {
    this.loadingPopular = true;
    const subscription = this.movieService.getPopularMovies({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.popularMovies = response.results || response.movies || [];
          this.loadingPopular = false;
        },
        error: (error) => {
          console.error('Error loading popular movies:', error);
          this.loadingPopular = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadNowPlayingMovies(): void {
    this.loadingNowPlaying = true;
    const subscription = this.movieService.getNowPlayingMovies({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.nowPlayingMovies = response.results || response.movies || [];
          this.loadingNowPlaying = false;
        },
        error: (error) => {
          console.error('Error loading now playing movies:', error);
          this.loadingNowPlaying = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadUpcomingMovies(): void {
    this.loadingUpcoming = true;
    const subscription = this.movieService.getUpcomingMovies({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.upcomingMovies = response.results || response.movies || [];
          this.loadingUpcoming = false;
        },
        error: (error) => {
          console.error('Error loading upcoming movies:', error);
          this.loadingUpcoming = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadTopRatedMovies(): void {
    this.loadingTopRated = true;
    const subscription = this.movieService.getTopRatedMovies({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.topRatedMovies = response.results || response.movies || [];
          this.loadingTopRated = false;
        },
        error: (error) => {
          console.error('Error loading top rated movies:', error);
          this.loadingTopRated = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  // Hero slider methods
  private startHeroSlider(): void {
    this.stopHeroSlider(); // Stop any existing timer
    
    if (this.featuredMovies.length > 1) {
      this.heroSliderInterval = timer(5000, 5000).subscribe(() => {
        this.nextSlide();
      });
    }
  }

  private stopHeroSlider(): void {
    if (this.heroSliderInterval) {
      this.heroSliderInterval.unsubscribe();
      this.heroSliderInterval = undefined;
    }
  }

  setCurrentSlide(index: number): void {
    this.currentSlide = index;
    this.restartHeroSlider(); // Reinicia o timer quando o usuário interagir
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredMovies.length;
    this.restartHeroSlider(); // Reinicia o timer
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.featuredMovies.length - 1 
      : this.currentSlide - 1;
    this.restartHeroSlider(); // Reinicia o timer
  }

  private restartHeroSlider(): void {
    this.stopHeroSlider();
    
    if (this.featuredMovies.length > 1) {
      // Pequeno delay para permitir que a transição visual aconteça
      setTimeout(() => {
        this.startHeroSlider();
      }, 100);
    }
  }

  // Scroll methods
  scrollLeft(container: HTMLElement): void {
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    
    // Força atualização dos botões após o scroll
    setTimeout(() => {
      this.updateScrollButtons();
    }, 300);
  }

  scrollRight(container: HTMLElement): void {
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Força atualização dos botões após o scroll
    setTimeout(() => {
      this.updateScrollButtons();
    }, 300);
  }

  canScrollLeft(container: HTMLElement): boolean {
    return container.scrollLeft > 10; // Margem de 10px para evitar problemas de precisão
  }

  canScrollRight(container: HTMLElement): boolean {
    const maxScroll = container.scrollWidth - container.offsetWidth;
    return container.scrollLeft < (maxScroll - 10); // Margem de 10px
  }

  private updateScrollButtons(): void {
    // Força detecção de mudanças no Angular
    // Este método pode ser chamado para forçar re-avaliação dos botões
  }

  onScrollChange(event: Event): void {
    // Força re-avaliação dos botões quando o usuário scrolla manualmente
    const target = event.target as HTMLElement;
    if (target) {
      // Pequeno delay para garantir que o scroll terminou
      setTimeout(() => {
        // Angular vai re-avaliar as expressões automaticamente
      }, 10);
    }
  }
  onMovieClick(movie: Movie): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onAddToWatchlist(movie: Movie): void {
    // TODO: Implement actual watchlist functionality
    this.errorHandler.showSuccess(`${movie.title} adicionado aos favoritos!`);
  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/movies/search'], { 
        queryParams: { q: query } 
      });
    }
  }

  onFiltersChange(filters: MovieFilters): void {
    this.activeFilters = filters;
    
    // Navigate to search with filters
    const hasFilters = filters.genre || filters.year || filters.minRating || filters.maxRating;
    
    if (hasFilters) {
      this.router.navigate(['/movies/search'], { 
        queryParams: { ...filters } 
      });
    }
  }

  onClearFilters(): void {
    this.activeFilters = {};
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  navigateToSection(section: string): void {
    this.router.navigate(['/movies/search'], { 
      queryParams: { category: section } 
    });
  }

  // Utility methods
  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  getBackdropUrl(movie: Movie): string {
    if (!movie.backdrop_path && !movie.backdrop_url) return '/assets/placeholder-backdrop.jpg';
    return movie.backdrop_url || `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  // Computed properties
  get hasAnyContent(): boolean {
    return this.popularMovies.length > 0 || 
           this.nowPlayingMovies.length > 0 || 
           this.upcomingMovies.length > 0 || 
           this.topRatedMovies.length > 0;
  }

  get isLoading(): boolean {
    return this.loadingFeatured || 
           this.loadingPopular || 
           this.loadingNowPlaying || 
           this.loadingUpcoming || 
           this.loadingTopRated;
  }
}