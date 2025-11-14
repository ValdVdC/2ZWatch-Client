import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieFilters } from '../../components/movie-filter/movie-filter';
import { PaginatedResponse, SearchParams } from '../../../../shared/models/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxonomyService } from '../../../taxonomy/services/taxonomy.service';
import { MovieService } from '../../services/movie.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movies-search',
  standalone: false,
  templateUrl: './movies-search.html',
  styleUrl: './movies-search.css'
})
export class MoviesSearch implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Data properties
  movies: Movie[] = [];
  paginationData?: PaginatedResponse<Movie>;
  genres: { id: number; name: string }[] = [];

  // Search & Filter states
  currentQuery = '';
  currentFilters: MovieFilters = {};
  showFilters = false;

  // View states
  loading = false;
  error: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  cardSize: 'small' | 'medium' | 'large' = 'medium';

  // Pagination
  currentPage = 1;
  pageSize = 20;

  constructor(
    private movieService: MovieService,
    private taxonomyService: TaxonomyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect to Explorer with movies type
    this.route.queryParams.subscribe(params => {
      const queryParams: any = {
        type: 'movies'
      };

      // Preserve existing query parameters
      if (params['q']) queryParams.q = params['q'];
      if (params['genre']) queryParams.genre = params['genre'];
      if (params['year']) queryParams.year = params['year'];
      if (params['rating']) queryParams.rating = params['rating'];
      if (params['sort']) queryParams.sort = params['sort'];
      if (params['page']) queryParams.page = params['page'];

      // Navigate to Explorer
      this.router.navigate(['/explorer'], { 
        queryParams,
        replaceUrl: true // Replace history entry to avoid back button issues
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadGenres(): void {
    const subscription = this.taxonomyService.getMovieGenres().subscribe({
      next: (genres) => {
        this.genres = Object.entries(genres).map(([id, name]) => ({
          id: Number(id),
          name: name
        }));
      }
    });
    this.subscriptions.push(subscription);
  }

  private subscribeToQueryParams(): void {
    const subscription = this.route.queryParams.subscribe(params => {
      this.currentQuery = params['q'] || '';
      this.currentPage = Number(params['page']) || 1;
      this.pageSize = Number(params['pageSize']) || 20;
      
      // Parse filters
      this.currentFilters = {
        genre: params['genre'] ? Number(params['genre']) : undefined,
        year: params['year'] ? Number(params['year']) : undefined,
        minRating: params['minRating'] ? Number(params['minRating']) : undefined,
        maxRating: params['maxRating'] ? Number(params['maxRating']) : undefined,
        sortBy: params['sortBy'] || 'popularity',
        sortOrder: params['sortOrder'] || 'desc'
      };

      this.performSearch();
    });
    this.subscriptions.push(subscription);
  }

  private performSearch(): void {
    this.loading = true;
    this.error = null;

    const searchParams: SearchParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      ...this.currentFilters
    };

    let searchObservable;

    if (this.currentQuery.trim()) {
      // Text search
      searchObservable = this.movieService.searchMovies(this.currentQuery, searchParams);
    } else if (this.currentFilters.genre) {
      // Genre filter
      searchObservable = this.movieService.getPopularMovies(searchParams);
    } else if (this.currentFilters.year) {
      // Year filter
      searchObservable = this.movieService.getMoviesByYear(this.currentFilters.year, searchParams);
    } else {
      // Default: popular movies
      searchObservable = this.movieService.getPopularMovies(searchParams);
    }

    const subscription = searchObservable.subscribe({
      next: (response) => {
        this.paginationData = response;
        this.movies = response.results || response.movies || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao buscar filmes. Tente novamente.';
        this.movies = [];
        this.loading = false;
      }
    });
    this.subscriptions.push(subscription);
  }

  // Event handlers
  onSearch(query: string): void {
    this.updateUrl({ q: query, page: 1 });
  }

  onFiltersChange(filters: MovieFilters): void {
    this.updateUrl({ ...filters, page: 1 });
  }

  onClearFilters(): void {
    this.updateUrl({ page: 1 });
  }

  onPageChange(page: number): void {
    this.updateUrl({ page });
  }

  onPageSizeChange(pageSize: number): void {
    this.updateUrl({ pageSize, page: 1 });
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  onMovieClick(movie: Movie): void {
    this.router.navigate(['/movies', movie.id]);
  }

  onAddToWatchlist(movie: Movie): void {
    // TODO: Implement watchlist functionality
    console.log('Add to watchlist:', movie.title);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  private updateUrl(params: any): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    
    // Update only provided params
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams[key] = params[key];
      } else {
        delete queryParams[key];
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  get searchTitle(): string {
    if (this.currentQuery) {
      return `Resultados para "${this.currentQuery}"`;
    }
    if (this.currentFilters.genre) {
      const genre = this.genres.find(g => g.id === this.currentFilters.genre);
      return `Filmes de ${genre?.name || 'Gênero'}`;
    }
    if (this.currentFilters.year) {
      return `Filmes de ${this.currentFilters.year}`;
    }
    return 'Todos os Filmes';
  }

  get hasResults(): boolean {
    return this.movies.length > 0;
  }

  get hasActiveFilters(): boolean {
    return !!(this.currentFilters.genre || 
              this.currentFilters.year || 
              this.currentFilters.minRating || 
              this.currentFilters.maxRating);
  }

  get popularGenres(): { id: number; name: string }[] {
    return this.genres.slice(0, 6); // Primeiros 6 gêneros
  }

  getGenreName(genreId: number): string {
    return this.genres.find(g => g.id === genreId)?.name || 'Gênero';
  }

  removeFilter(filterType: string): void {
    const filters = { ...this.currentFilters };
    
    switch (filterType) {
      case 'genre':
        delete filters.genre;
        break;
      case 'year':
        delete filters.year;
        break;
      case 'rating':
        delete filters.minRating;
        delete filters.maxRating;
        break;
    }
    
    this.updateUrl(filters);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
