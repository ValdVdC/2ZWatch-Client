import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Series } from '../../models/series.model';
import { PaginatedResponse } from '../../../../shared/models/common.model';

@Component({
  selector: 'app-series-list',
  standalone: false,
  templateUrl: './series-list.html',
  styleUrl: './series-list.css'
})
export class SeriesList {
  @Input() series: Series[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() cardSize: 'small' | 'medium' | 'large' = 'medium';
  @Input() showGenres: boolean = false;
  @Input() showPagination: boolean = true;
  @Input() paginationData?: PaginatedResponse<Series>;
  
  @Output() seriesClick = new EventEmitter<Series>();
  @Output() addToWatchlist = new EventEmitter<Series>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();

  get hasSeries(): boolean {
    return this.series && this.series.length > 0;
  }

  get emptyMessage(): string {
    if (this.loading) return '';
    return this.error || 'Nenhum filme encontrado';
  }

  get gridColumns(): string {
    switch (this.cardSize) {
      case 'small': return 'repeat(auto-fill, minmax(150px, 1fr))';
      case 'medium': return 'repeat(auto-fill, minmax(200px, 1fr))';
      case 'large': return 'repeat(auto-fill, minmax(280px, 1fr))';
      default: return 'repeat(auto-fill, minmax(200px, 1fr))';
    }
  }

  onSeriesClick(series: Series): void {
    this.seriesClick.emit(series);
  }

  onAddToWatchlist(series: Series): void {
    this.addToWatchlist.emit(series);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  toggleViewMode(): void {
    const newMode = this.viewMode === 'grid' ? 'list' : 'grid';
    this.viewModeChange.emit(newMode);
  }

  trackBySeriesId(index: number, series: Series): number {
    return series.id;
  }
}
