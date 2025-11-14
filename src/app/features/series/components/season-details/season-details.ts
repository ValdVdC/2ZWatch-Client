import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SeriesService } from '../../services/series.service';
import { SeasonDetails, Episode } from '../../models/series.model';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-season-details',
  standalone: false,
  templateUrl: './season-details.html',
  styleUrl: './season-details.css'
})
export class SeasonDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  season: SeasonDetails | null = null;
  loading = false;
  error: string | null = null;
  seriesId: number = 0;
  seasonNumber: number = 0;

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
    const paramSubscription = this.route.params.subscribe(params => {
      this.seriesId = Number(params['id']);
      this.seasonNumber = Number(params['seasonNumber']);
      
      if (this.seriesId && this.seasonNumber >= 0) {
        this.loadSeasonDetails();
      }
    });

    this.subscriptions.push(paramSubscription);
  }

  private loadSeasonDetails(): void {
    this.loading = true;
    this.error = null;

    const subscription = this.seriesService.getSeasonDetails(this.seriesId, this.seasonNumber).subscribe({
      next: (season) => {
        this.season = season;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar detalhes da temporada';
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Getters
  get posterUrl(): string {
    if (this.season?.poster_url) return this.season.poster_url;
    if (this.season?.poster_path) return `https://image.tmdb.org/t/p/w500${this.season.poster_path}`;
    return '/assets/placeholder-series.jpg';
  }

  get airYear(): string {
    if (!this.season?.air_date) return '';
    return new Date(this.season.air_date).getFullYear().toString();
  }

  // Methods
  goBack(): void {
    this.location.back();
  }

  retry(): void {
    this.loadSeasonDetails();
  }

  viewEpisode(episode: Episode): void {
    this.router.navigate(['/series', this.seriesId, 'season', this.seasonNumber, 'episode', episode.episode_number]);
  }

  getEpisodeStill(episode: Episode): string {
    if (episode.still_url) return episode.still_url;
    if (episode.still_path) return `https://image.tmdb.org/t/p/w300${episode.still_path}`;
    return '/assets/placeholder-episode.jpg';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  formatRuntime(minutes?: number): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }

  getRating(episode: Episode): string {
    return (episode.vote_average || 0).toFixed(1);
  }
}
