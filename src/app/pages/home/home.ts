import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Movie } from '../../features/movies/models/movie.model';
import { Series } from '../../features/series/models/series.model';
import { MovieService } from '../../features/movies/services/movie.service';
import { SeriesService } from '../../features/series/services/series.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  
  // Data properties
  popularMovies: Movie[] = [];
  popularSeries: Series[] = [];
  loadingMovies = false;
  loadingSeries = false;
  
  // Hero section properties
  heroItems: (Movie | Series)[] = [];
  currentHeroIndex = 0;
  heroIntervalId?: number;

  // Features data
  features = [
    {
      icon: '🎬',
      title: 'Filmes em Alta',
      description: 'Descubra os filmes mais populares e bem avaliados do momento.',
      action: 'Ver Filmes'
    },
    {
      icon: '📺',
      title: 'Séries Incríveis',
      description: 'Explore séries aclamadas pela crítica e pelo público.',
      action: 'Ver Séries'
    },
    {
      icon: '🔍',
      title: 'Busca Avançada',
      description: 'Encontre exatamente o que você procura com nossos filtros.',
      action: 'Buscar'
    },
    {
      icon: '⭐',
      title: 'Avaliações',
      description: 'Veja avaliações e ratings de milhões de usuários.',
      action: 'Explorar'
    }
  ];

  constructor(
    private movieService: MovieService,
    private seriesService: SeriesService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadPopularContent();
    this.startHeroRotation();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.heroIntervalId) {
      clearInterval(this.heroIntervalId);
    }
  }

  private loadPopularContent(): void {
    this.loadPopularMovies();
    this.loadPopularSeries();
  }

  private loadPopularMovies(): void {
    this.loadingMovies = true;
    const subscription = this.movieService.getPopularMovies({ page: 1, pageSize: 8 })
      .subscribe({
        next: (response) => {
          this.popularMovies = response.results || response.movies || [];
          this.updateHeroItems();
          this.loadingMovies = false;
        },
        error: () => {
          this.loadingMovies = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private loadPopularSeries(): void {
    this.loadingSeries = true;
    const subscription = this.seriesService.getPopularSeries({ page: 1, pageSize: 8 })
      .subscribe({
        next: (response) => {
          this.popularSeries = response.results || response.series || [];
          this.updateHeroItems();
          this.loadingSeries = false;
        },
        error: () => {
          this.loadingSeries = false;
        }
      });
    this.subscriptions.push(subscription);
  }

  private updateHeroItems(): void {
    this.heroItems = [
      ...this.popularMovies.slice(0, 3),
      ...this.popularSeries.slice(0, 3)
    ].sort(() => Math.random() - 0.5);
  }

  private startHeroRotation(): void {
    this.heroIntervalId = window.setInterval(() => {
      if (this.heroItems.length > 1) {
        this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroItems.length;
      }
    }, 5000);
  }

  get currentHeroItem(): Movie | Series | null {
    return this.heroItems[this.currentHeroIndex] || null;
  }

  // Helper methods
  isMovie(item: Movie | Series): item is Movie {
    return 'title' in item;
  }

  getTitle(item: Movie | Series): string {
    return this.isMovie(item) ? item.title : item.name;
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return '/assets/placeholder.jpg';
    return `https://image.tmdb.org/t/p/w1280${path}`;
  }

  getRating(rating: number): string {
    return (rating || 0).toFixed(1);
  }

  // Navigation methods
  goToHeroItem(index: number): void {
    this.currentHeroIndex = index;
  }

  onSearchSubmit(query: string): void {
    if (query.trim()) {
      // Navigate to search page with query
      console.log('Search:', query);
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  onHeroClick(): void {
    const item = this.currentHeroItem;
    if (item) {
      const type = this.isMovie(item) ? 'movies' : 'series';
      window.location.href = `/${type}/${item.id}`;
    }
  }
  onCardClick(item: Movie | Series): void {
    const type = this.isMovie(item) ? 'movies' : 'series';
    window.location.href = `/${type}/${item.id}`;
  }
}