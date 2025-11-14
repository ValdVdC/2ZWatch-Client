import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SeriesService } from '../../services/series.service';
import { EpisodeDetails } from '../../models/series.model';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-episode-details',
  standalone: false,
  templateUrl: './episode-details.html',
  styleUrl: './episode-details.css'
})
export class EpisodeDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  episode: EpisodeDetails | null = null;
  loading = false;
  error: string | null = null;
  seriesId: number = 0;
  seasonNumber: number = 0;
  episodeNumber: number = 0;

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
      this.episodeNumber = Number(params['episodeNumber']);
      
      if (this.seriesId && this.seasonNumber >= 0 && this.episodeNumber > 0) {
        this.loadEpisodeDetails();
      }
    });

    this.subscriptions.push(paramSubscription);
  }

  private loadEpisodeDetails(): void {
    this.loading = true;
    this.error = null;

    const subscription = this.seriesService.getEpisodeDetails(
      this.seriesId, 
      this.seasonNumber, 
      this.episodeNumber
    ).subscribe({
      next: (episode) => {
        this.episode = episode;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar detalhes do episódio';
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Getters
  get stillUrl(): string {
    if (this.episode?.still_url) return this.episode.still_url;
    if (this.episode?.still_path) return `https://image.tmdb.org/t/p/w1280${this.episode.still_path}`;
    return '/assets/placeholder-episode.jpg';
  }

  get rating(): string {
    return (this.episode?.vote_average || 0).toFixed(1);
  }

  get ratingPercentage(): number {
    return Math.round((this.episode?.vote_average || 0) * 10);
  }

  // Methods
  goBack(): void {
    this.location.back();
  }

  retry(): void {
    this.loadEpisodeDetails();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  getCrewByDepartment(department: string): any[] {
    return this.episode?.crew?.filter(c => c.department === department) || [];
  }

  getDirectors(): any[] {
    return this.episode?.crew?.filter(c => c.job === 'Director') || [];
  }

  getWriters(): any[] {
    return this.episode?.crew?.filter(c => c.job === 'Writer' || c.job === 'Screenplay') || [];
  }

  getProfileUrl(profilePath?: string): string {
    if (!profilePath) return '/assets/placeholder-person.jpg';
    return `https://image.tmdb.org/t/p/w185${profilePath}`;
  }
}
