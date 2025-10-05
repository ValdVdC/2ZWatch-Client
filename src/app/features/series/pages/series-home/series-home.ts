import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Series } from '../../models/series.model';
import { Subscription, timer } from 'rxjs';
import { SeriesFilters } from '../../components/series-filter/series-filter';
import { SeriesService } from '../../services/series.service';
import { TaxonomyService } from '../../../taxonomy/services/taxonomy.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-series-home',
  standalone: false,
  templateUrl: './series-home.html',
  styleUrl: './series-home.css'
})
export class SeriesHome implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions: Subscription[] = [];
  private heroSliderInterval?: Subscription;

  @ViewChildren('scrollContainer') scrollContainers!: QueryList<ElementRef>;

  // Data properties
  featuredSeries: Series[] = [];
  popularSeries: Series[] = [];
  nowPlayingSeries: Series[] = [];
  upcomingSeries: Series[] = [];
  topRatedSeries: Series[] = [];
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
  activeFilters: SeriesFilters = {};

  constructor(
    private seriesService: SeriesService,
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
    const subscription = this.taxonomyService.getSeriesGenres().subscribe({
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
    this.loadFeaturedSeries();
    this.loadPopularSeries();
    this.loadNowPlayingSeries();
    this.loadUpcomingSeries();
    this.loadTopRatedSeries();
  }

  private loadFeaturedSeries(): void {
    this.loadingFeatured = true;
    const subscription = this.seriesService.getPopularSeries({ page: 1, pageSize: 5 })
      .subscribe({
        next: (response) => {
          this.featuredSeries = (response.results || response.series || []).slice(0, 5);
          this.loadingFeatured = false;
          
          // Start slider if we have series
          if (this.featuredSeries.length > 1) {
            this.startHeroSlider();
          }
        },
        error: (error) => {
          console.error('Error loading featured series:', error);
          this.loadingFeatured = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadPopularSeries(): void {
    this.loadingPopular = true;
    const subscription = this.seriesService.getPopularSeries({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.popularSeries = response.results || response.series || [];
          this.loadingPopular = false;
        },
        error: (error) => {
          console.error('Error loading popular series:', error);
          this.loadingPopular = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadNowPlayingSeries(): void {
    this.loadingNowPlaying = true;
    const subscription = this.seriesService.getNowPlayingSeries({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.nowPlayingSeries = response.results || response.series || [];
          this.loadingNowPlaying = false;
        },
        error: (error) => {
          console.error('Error loading now playing series:', error);
          this.loadingNowPlaying = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadUpcomingSeries(): void {
    this.loadingUpcoming = true;
    const subscription = this.seriesService.getUpcomingSeries({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.upcomingSeries = response.results || response.series || [];
          this.loadingUpcoming = false;
        },
        error: (error) => {
          console.error('Error loading upcoming series:', error);
          this.loadingUpcoming = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadTopRatedSeries(): void {
    this.loadingTopRated = true;
    const subscription = this.seriesService.getTopRatedSeries({ page: 1, pageSize: 20 })
      .subscribe({
        next: (response) => {
          this.topRatedSeries = response.results || response.series || [];
          this.loadingTopRated = false;
        },
        error: (error) => {
          console.error('Error loading top rated series:', error);
          this.loadingTopRated = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  // Hero slider methods
  private startHeroSlider(): void {
    this.stopHeroSlider(); // Stop any existing timer
    
    if (this.featuredSeries.length > 1) {
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
    this.currentSlide = (this.currentSlide + 1) % this.featuredSeries.length;
    this.restartHeroSlider(); // Reinicia o timer
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.featuredSeries.length - 1 
      : this.currentSlide - 1;
    this.restartHeroSlider(); // Reinicia o timer
  }

  private restartHeroSlider(): void {
    this.stopHeroSlider();
    
    if (this.featuredSeries.length > 1) {
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
  onSeriesClick(series: Series): void {
    this.router.navigate(['/series', series.id]);
  }

  onAddToWatchlist(series: Series): void {
    // TODO: Implement actual watchlist functionality
    this.errorHandler.showSuccess(`${series.name} adicionado aos favoritos!`);
  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/series/search'], { 
        queryParams: { q: query } 
      });
    }
  }

  onFiltersChange(filters: SeriesFilters): void {
    this.activeFilters = filters;
    
    // Navigate to search with filters
    const hasFilters = filters.genre || filters.year || filters.minRating || filters.maxRating;
    
    if (hasFilters) {
      this.router.navigate(['/series/search'], { 
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
    this.router.navigate(['/series/search'], { 
      queryParams: { category: section } 
    });
  }

  // Utility methods
  trackBySeriesId(index: number, series: Series): number {
    return series.id;
  }

  getBackdropUrl(series: Series): string {
    if (!series.backdrop_path && !series.backdrop_url) return '/assets/placeholder-backdrop.jpg';
    return series.backdrop_url || `https://image.tmdb.org/t/p/w1280${series.backdrop_path}`;
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).getFullYear().toString();
  }

  // Computed properties
  get hasAnyContent(): boolean {
    return this.popularSeries.length > 0 || 
           this.nowPlayingSeries.length > 0 || 
           this.upcomingSeries.length > 0 || 
           this.topRatedSeries.length > 0;
  }

  get isLoading(): boolean {
    return this.loadingFeatured || 
           this.loadingPopular || 
           this.loadingNowPlaying || 
           this.loadingUpcoming || 
           this.loadingTopRated;
  }
}
