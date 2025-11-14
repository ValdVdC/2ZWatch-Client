import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from '../../features/movies/models/movie.model';
import { Series } from '../../features/series/models/series.model';
import { MovieService } from '../../features/movies/services/movie.service';
import { SeriesService } from '../../features/series/services/series.service';
import { TaxonomyService } from '../../features/taxonomy/services/taxonomy.service';

type ContentType = 'movies' | 'series';

interface FilterState {
  genre?: string;
  year?: number;
  minRating?: number;
  sortBy?: string;
}

@Component({
  selector: 'app-explorer',
  standalone: false,
  templateUrl: './explorer.html',
  styleUrl: './explorer.css'
})
export class Explorer implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Content type toggle
  contentType: ContentType = 'movies';

  // Data
  movies: Movie[] = [];
  series: Series[] = [];
  loading = false;

  // Cached data for pagination
  allMovies: Movie[] = [];
  allSeries: Series[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;
  lastKnownPage = 1;
  hasMore = true;
  
  // API pagination tracking
  nextApiPage = 1;
  isLoadingMore = false;
  batchSize = 10; // Number of API pages to fetch at once (10 pages = 200 items with 20 per page)

  // Filters
  filters: FilterState = {
    sortBy: 'popularity'
  };
  
  // Genre options
  movieGenres: { [key: string]: string } = {};
  seriesGenres: { [key: string]: string } = {};
  
  // Years (last 30 years)
  years: number[] = [];

  // Sort options
  sortOptions = [
    { value: 'popularity', label: 'Popularidade' },
    { value: 'vote_average', label: 'Avaliação' },
    { value: 'release_date', label: 'Mais Recentes' },
    { value: 'title', label: 'Título (A-Z)' }
  ];

  // Filter panel
  showFilters = false;

  // Search
  searchQuery = '';

  constructor(
    private movieService: MovieService,
    private seriesService: SeriesService,
    private taxonomyService: TaxonomyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeYears();
    this.loadGenres();
    this.loadFromQueryParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 30; i++) {
      this.years.push(currentYear - i);
    }
  }

  private loadGenres(): void {
    const movieGenresSub = this.taxonomyService.getMovieGenres()
      .subscribe(genres => this.movieGenres = genres);
    
    const seriesGenresSub = this.taxonomyService.getSeriesGenres()
      .subscribe(genres => this.seriesGenres = genres);

    this.subscriptions.push(movieGenresSub, seriesGenresSub);
  }

  private loadFromQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const previousType = this.contentType;
      const previousSearch = this.searchQuery;
      
      this.contentType = (params['type'] as ContentType) || 'movies';
      this.searchQuery = params['q'] || '';
      this.filters.genre = params['genre'];
      this.filters.year = params['year'] ? parseInt(params['year']) : undefined;
      this.filters.minRating = params['rating'] ? parseFloat(params['rating']) : undefined;
      this.filters.sortBy = params['sort'] || 'popularity';
      this.currentPage = params['page'] ? parseInt(params['page']) : 1;

      // Reset cache if content type changed or search changed
      if (previousType !== this.contentType || previousSearch !== this.searchQuery) {
        this.resetCache();
      }

      this.loadContent();
    });
  }

  private updateQueryParams(): void {
    const queryParams: any = {
      type: this.contentType,
      page: this.currentPage
    };

    if (this.searchQuery) queryParams.q = this.searchQuery;
    if (this.filters.genre) queryParams.genre = this.filters.genre;
    if (this.filters.year) queryParams.year = this.filters.year;
    if (this.filters.minRating) queryParams.rating = this.filters.minRating;
    if (this.filters.sortBy) queryParams.sort = this.filters.sortBy;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  loadContent(): void {
    if (this.searchQuery) {
      this.searchContent();
    } else {
      this.loadPopularContent();
    }
  }

  private resetCache(): void {
    this.allMovies = [];
    this.allSeries = [];
    this.nextApiPage = 1;
    this.lastKnownPage = 1;
    this.hasMore = true;
  }

  private async loadPopularContent(): Promise<void> {
    // Check if we need to load more data from API
    // This happens when user is near the end of cached data
    const needsData = this.currentPage >= this.lastKnownPage && this.hasMore;
    
    if (needsData && !this.isLoadingMore) {
      await this.fetchMoreBatches();
    }

    // Update the display with current page data
    this.updateCurrentPageData();
  }

  private async fetchMoreBatches(): Promise<void> {
    this.isLoadingMore = true;
    this.loading = this.currentPage === 1 && (this.allMovies.length === 0 && this.allSeries.length === 0);

    const promises: Promise<any>[] = [];
    const startPage = this.nextApiPage;
    const endPage = Math.min(startPage + this.batchSize - 1, 500); // API max is usually 500 pages

    // Fetch multiple pages in parallel for better performance
    // Each page has ~20 items, so 10 pages = ~200 items
    for (let page = startPage; page <= endPage; page++) {
      const params = { page, pageSize: 20 };
      
      const promise = this.contentType === 'movies' ?
        this.movieService.getPopularMovies(params).toPromise() :
        this.seriesService.getPopularSeries(params).toPromise();
      
      promises.push(promise);
    }

    try {
      const responses = await Promise.all(promises);
      
      responses.forEach((response, index) => {
        if (response) {
          const items = response.results || response.movies || response.series || [];
          
          if (this.contentType === 'movies') {
            this.allMovies.push(...items);
          } else {
            this.allSeries.push(...items);
          }

          // Check if this was the last page (no more content available)
          if (items.length < 20 || !response.pagination?.hasMore) {
            this.hasMore = false;
          }
        }
      });

      this.nextApiPage = endPage + 1;
      this.calculatePagination();
      
    } catch (error) {
      console.error('Error loading content:', error);
      this.hasMore = false;
    } finally {
      this.isLoadingMore = false;
      this.loading = false;
    }
  }

  private calculatePagination(): void {
    const allItems = this.contentType === 'movies' ? this.allMovies : this.allSeries;
    const filteredItems = this.filterAndSortContent(allItems);
    
    this.lastKnownPage = Math.ceil(filteredItems.length / this.itemsPerPage);
    
    // Always show one more page if we think there's more content
    this.totalPages = this.hasMore ? this.lastKnownPage + 1 : this.lastKnownPage;
    
    // Ensure totalPages is at least 1
    this.totalPages = Math.max(1, this.totalPages);
  }

  private updateCurrentPageData(): void {
    const allItems = this.contentType === 'movies' ? this.allMovies : this.allSeries;
    const filteredItems = this.filterAndSortContent(allItems);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    if (this.contentType === 'movies') {
      this.movies = filteredItems.slice(startIndex, endIndex) as Movie[];
    } else {
      this.series = filteredItems.slice(startIndex, endIndex) as Series[];
    }

    this.calculatePagination();
  }

  private searchContent(): void {
    this.loading = true;
    this.resetCache();
    
    const params = {
      page: this.currentPage,
      pageSize: 20
    };

    const subscription = this.contentType === 'movies' ?
      this.movieService.searchMovies(this.searchQuery, params).subscribe(this.handleSearchResponse.bind(this)) :
      this.seriesService.searchSeries(this.searchQuery, params).subscribe(this.handleSearchResponse.bind(this));

    this.subscriptions.push(subscription);
  }

  private handleSearchResponse(response: any): void {
    if (this.contentType === 'movies') {
      this.movies = this.filterAndSortContent(response.results || response.movies || []) as Movie[];
    } else {
      this.series = this.filterAndSortContent(response.results || response.series || []) as Series[];
    }

    this.totalPages = response.pagination?.totalPages || 1;
    this.lastKnownPage = this.totalPages;
    this.hasMore = response.pagination?.hasMore || false;
    this.loading = false;
  }

  private filterAndSortContent(content: (Movie | Series)[]): (Movie | Series)[] {
    let filtered = [...content];

    // Filter by genre
    if (this.filters.genre) {
      filtered = filtered.filter(item => 
        item.genre_ids?.includes(parseInt(this.filters.genre!))
      );
    }

    // Filter by year
    if (this.filters.year) {
      filtered = filtered.filter(item => {
        const date = this.isMovie(item) ? item.release_date : item.first_air_date;
        return date?.startsWith(this.filters.year!.toString());
      });
    }

    // Filter by rating
    if (this.filters.minRating) {
      filtered = filtered.filter(item => 
        (item.vote_average || 0) >= this.filters.minRating!
      );
    }

    // Sort
    filtered = this.sortContent(filtered);

    return filtered;
  }

  private sortContent(content: (Movie | Series)[]): (Movie | Series)[] {
    const sorted = [...content];

    switch (this.filters.sortBy) {
      case 'vote_average':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'release_date':
        return sorted.sort((a, b) => {
          const dateA = this.isMovie(a) ? a.release_date : a.first_air_date;
          const dateB = this.isMovie(b) ? b.release_date : b.first_air_date;
          return (dateB || '').localeCompare(dateA || '');
        });
      case 'title':
        return sorted.sort((a, b) => {
          const titleA = this.getTitle(a);
          const titleB = this.getTitle(b);
          return titleA.localeCompare(titleB);
        });
      default: // popularity
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  }

  // UI Actions
  toggleContentType(type: ContentType): void {
    if (this.contentType !== type) {
      this.contentType = type;
      this.currentPage = 1;
      this.resetCache();
      this.updateQueryParams();
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    
    // If search is empty and we have cached data, use it
    if (!query && ((this.contentType === 'movies' && this.allMovies.length > 0) || 
                   (this.contentType === 'series' && this.allSeries.length > 0))) {
      this.updateCurrentPageData();
    } else if (query) {
      this.resetCache();
      this.loadContent();
    } else {
      // No cache, need to load
      this.resetCache();
      this.loadContent();
    }
    
    this.updateQueryParams();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.updateCurrentPageData();
    this.updateQueryParams();
  }

  clearFilters(): void {
    this.filters = { sortBy: 'popularity' };
    this.searchQuery = '';
    this.currentPage = 1;
    
    // If we have cached data, just update the view
    if (this.contentType === 'movies' && this.allMovies.length > 0) {
      this.updateCurrentPageData();
    } else if (this.contentType === 'series' && this.allSeries.length > 0) {
      this.updateCurrentPageData();
    } else {
      // If no cached data, load from API
      this.loadContent();
    }
    
    this.updateQueryParams();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
    this.loadContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCardClick(item: Movie | Series): void {
    const id = item.id;
    const route = this.contentType === 'movies' ? '/movies' : '/series';
    this.router.navigate([route, id]);
  }

  // Helper methods
  get currentGenres(): { [key: string]: string } {
    return this.contentType === 'movies' ? this.movieGenres : this.seriesGenres;
  }

  get currentContent(): (Movie | Series)[] {
    return this.contentType === 'movies' ? this.movies : this.series;
  }

  get genreEntries(): [string, string][] {
    return Object.entries(this.currentGenres);
  }

  isMovie(item: Movie | Series): item is Movie {
    return 'title' in item;
  }

  getTitle(item: Movie | Series): string {
    return this.isMovie(item) ? item.title : item.name;
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return '/assets/placeholders/poster.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getRating(rating: number): string {
    return (rating || 0).toFixed(1);
  }

  getYear(item: Movie | Series): string {
    const date = this.isMovie(item) ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear().toString() : 'N/A';
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.genre || this.filters.year || this.filters.minRating);
  }
}
