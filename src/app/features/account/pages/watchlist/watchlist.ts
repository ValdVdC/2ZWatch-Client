import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WatchlistService } from '../../services/watchlist.service';
import { WatchlistItem } from '../../models/account.model';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationModalComponent],
  template: `
    <!-- Confirmation Modal -->
    <app-confirmation-modal
      [isOpen]="showModal"
      title="Remover da Watchlist"
      [message]="'Tem certeza que deseja remover ' + (itemToRemove?.title || '') + ' da watchlist?'"
      confirmText="Remover"
      cancelText="Cancelar"
      confirmClass="warning"
      iconClass="bi bi-bookmark-fill text-warning"
      (confirm)="confirmRemove()"
      (cancel)="cancelRemove()"
    ></app-confirmation-modal>

    <div class="watchlist-container">
      <div class="page-header">
        <h1>📋 Minha Watchlist</h1>
        <p class="subtitle">{{ watchlist.length }} {{ watchlist.length === 1 ? 'item' : 'itens' }} para assistir</p>
      </div>

      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando watchlist...</p>
      </div>

      <div *ngIf="!isLoading && watchlist.length === 0" class="empty-state">
        <div class="empty-icon">📺</div>
        <h2>Sua watchlist está vazia</h2>
        <p>Adicione filmes e séries que você quer assistir!</p>
        <a routerLink="/explorer" class="explore-btn">Explorar Conteúdo</a>
      </div>

      <div *ngIf="!isLoading && watchlist.length > 0" class="watchlist-grid">
        <div *ngFor="let item of watchlist" class="watchlist-card" [class]="'priority-' + item.priority">
          <a [routerLink]="getMediaLink(item)" class="card-link">
            <div class="poster-wrapper">
              <img [src]="getImageUrl(item.posterPath)" [alt]="item.title" class="poster" />
              <div class="priority-badge" [class]="'priority-' + item.priority">
                {{ getPriorityEmoji(item.priority) }} {{ item.priority }}
              </div>
            </div>
          </a>
          
          <div class="card-content">
            <a [routerLink]="getMediaLink(item)" class="title-link">
              <h3 class="title">{{ item.title }}</h3>
            </a>
            <p *ngIf="item.notes" class="notes">{{ item.notes }}</p>
            <div class="actions">
              <select [(ngModel)]="item.priority" (change)="updatePriority(item)" class="priority-select">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
              <button (click)="removeFromWatchlist(item)" class="remove-btn">❌</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===== WATCHLIST PAGE ===== */
    .watchlist-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem 4rem;
      padding-top: 6rem;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    /* ===== PAGE HEADER ===== */
    .page-header {
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin: 0;
    }

    /* ===== LOADING & EMPTY ===== */
    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 1.5rem;
      padding: 3rem 1rem;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-icon {
      font-size: 5rem;
      opacity: 0.6;
    }

    .empty-state h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .empty-state p {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin: 0.5rem 0 1.5rem;
    }

    .explore-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 2rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
    }

    .explore-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.4);
    }

    /* ===== WATCHLIST GRID ===== */
    .watchlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }

    /* ===== WATCHLIST CARD ===== */
    .watchlist-card {
      background: var(--bg-secondary);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .watchlist-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .watchlist-card.priority-high {
      border-color: var(--error-color);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
    }

    .watchlist-card.priority-high:hover {
      box-shadow: 0 0 30px rgba(239, 68, 68, 0.4), var(--shadow-xl);
    }

    .watchlist-card.priority-medium {
      border-color: var(--warning-color);
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
    }

    .watchlist-card.priority-medium:hover {
      box-shadow: 0 0 30px rgba(245, 158, 11, 0.4), var(--shadow-xl);
    }

    .watchlist-card.priority-low {
      border-color: var(--border-color);
    }

    .card-link {
      text-decoration: none;
      color: inherit;
    }

    .poster-wrapper {
      position: relative;
      aspect-ratio: 2/3;
      overflow: hidden;
      background: var(--bg-tertiary);
    }

    .poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .watchlist-card:hover .poster {
      transform: scale(1.1);
    }

    .priority-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 2px solid;
    }

    .priority-badge.priority-high {
      color: var(--error-color);
      border-color: var(--error-color);
    }

    .priority-badge.priority-medium {
      color: var(--warning-color);
      border-color: var(--warning-color);
    }

    .priority-badge.priority-low {
      color: var(--text-muted);
      border-color: var(--border-color);
    }

    /* ===== CARD CONTENT ===== */
    .card-content {
      padding: 1rem;
    }

    .title-link {
      text-decoration: none;
      color: inherit;
    }

    .title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.3;
      color: var(--text-primary);
      transition: color 0.3s ease;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .title-link:hover .title {
      color: var(--primary-color);
    }

    .notes {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0 0 1rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .priority-select {
      flex: 1;
      padding: 0.5rem 0.75rem;
      background: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .priority-select:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .priority-select:hover {
      border-color: var(--primary-color);
    }

    .remove-btn {
      padding: 0.5rem 0.75rem;
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .remove-btn:hover {
      background: var(--error-color);
      color: white;
      border-color: var(--error-color);
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .watchlist-container {
        padding: 1rem;
        padding-top: 5rem;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .watchlist-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .watchlist-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class WatchlistComponent implements OnInit {
  watchlist: WatchlistItem[] = [];
  isLoading = true;
  showModal = false;
  itemToRemove: WatchlistItem | null = null;

  constructor(private watchlistService: WatchlistService) {}

  ngOnInit(): void {
    this.watchlistService.loadWatchlist().subscribe({
      next: (items) => {
        this.watchlist = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar watchlist:', err);
        this.isLoading = false;
      }
    });
  }

  updatePriority(item: WatchlistItem): void {
    this.watchlistService.updatePriority(item.id, item.priority).subscribe();
  }

  removeFromWatchlist(item: WatchlistItem): void {
    this.itemToRemove = item;
    this.showModal = true;
  }

  confirmRemove(): void {
    if (this.itemToRemove) {
      this.watchlistService.removeFromWatchlistByMedia(
        this.itemToRemove.mediaType, 
        this.itemToRemove.mediaId
      ).subscribe(() => {
        this.watchlist = this.watchlist.filter(i => i.id !== this.itemToRemove!.id);
        this.itemToRemove = null;
      });
    }
  }

  cancelRemove(): void {
    this.itemToRemove = null;
    this.showModal = false;
  }

  getImageUrl(posterPath?: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/placeholders/person.png';
  }

  getMediaLink(item: WatchlistItem): string {
    return `/${item.mediaType === 'movie' ? 'movies' : 'series'}/${item.mediaId}`;
  }

  getPriorityEmoji(priority: string): string {
    const emojis: any = { high: '🔥', medium: '⚡', low: '⏳' };
    return emojis[priority] || '';
  }
}
