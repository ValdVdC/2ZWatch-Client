import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../../core/services/rating.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrls: ['./rating.css']
})
export class RatingComponent implements OnInit {
  @Input() mediaType!: 'movie' | 'series';
  @Input() mediaId!: number;
  @Output() ratingChanged = new EventEmitter<number>();

  userRating: number | null = null;
  averageRating: number = 0;
  totalRatings: number = 0;
  hoveredStar: number = 0;
  isAuthenticated = false;
  errorMessage: string | null = null;

  constructor(
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadRatings();
  }

  loadRatings(): void {
    // Carregar média de avaliações
    this.ratingService.getAverageRating(this.mediaType, this.mediaId).subscribe({
      next: (data) => {
        this.averageRating = data.average;
        this.totalRatings = data.count;
      },
      error: (error) => console.error('Erro ao carregar média:', error)
    });

    // Carregar avaliação do usuário se estiver autenticado
    if (this.isAuthenticated) {
      this.ratingService.getUserRating(this.mediaType, this.mediaId).subscribe({
        next: (data) => {
          this.userRating = data.rating;
        },
        error: (error) => console.error('Erro ao carregar avaliação do usuário:', error)
      });
    }
  }

  setRating(rating: number): void {
    if (!this.isAuthenticated) {
      this.showError('Você precisa estar logado para avaliar');
      return;
    }

    this.ratingService.setRating(this.mediaType, this.mediaId, rating).subscribe({
      next: () => {
        this.userRating = rating;
        this.loadRatings(); // Recarregar média
        this.ratingChanged.emit(rating);
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erro ao salvar avaliação:', error);
        this.showError('Erro ao salvar avaliação. Tente novamente.');
      }
    });
  }

  showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  onMouseEnter(star: number): void {
    this.hoveredStar = star;
  }

  onMouseLeave(): void {
    this.hoveredStar = 0;
  }

  getStarClass(star: number): string {
    const rating = this.hoveredStar || this.userRating || 0;
    return star <= rating ? 'filled' : 'empty';
  }
}
