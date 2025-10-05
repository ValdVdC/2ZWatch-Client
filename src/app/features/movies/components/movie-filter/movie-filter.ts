import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface MovieFilters {
  genre?: number;
  year?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Component({
  selector: 'app-movie-filter',
  standalone: false,
  templateUrl: './movie-filter.html',
  styleUrl: './movie-filter.css'
})
export class MovieFilter implements OnInit{
  @Input() genres: { id: number; name: string }[] = [];
  @Input() isOpen: boolean = false;
  @Input() initialFilters?: MovieFilters;
  
  @Output() filtersChange = new EventEmitter<MovieFilters>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  filterForm!: FormGroup;
  
  years: number[] = [];
  sortOptions = [
    { value: 'popularity', label: 'Popularidade' },
    { value: 'vote_average', label: 'Avaliação' },
    { value: 'release_date', label: 'Data de Lançamento' },
    { value: 'title', label: 'Título' }
  ];

  constructor(private fb: FormBuilder) {
    this.generateYears();
    this.initForm();
  }

  ngOnInit(): void {
    // Subscribe to form changes
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(values => {
      this.emitFilters(values);
    });

    // Set initial values if provided
    if (this.initialFilters) {
      this.filterForm.patchValue(this.initialFilters);
    }
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      genre: [null],
      year: [null],
      minRating: [null],
      maxRating: [null],
      sortBy: ['popularity'],
      sortOrder: ['desc']
    });
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  private emitFilters(values: any): void {
    const filters: MovieFilters = {};
    
    if (values.genre) filters.genre = values.genre;
    if (values.year) filters.year = values.year;
    if (values.minRating) filters.minRating = values.minRating;
    if (values.maxRating) filters.maxRating = values.maxRating;
    if (values.sortBy) filters.sortBy = values.sortBy;
    if (values.sortOrder) filters.sortOrder = values.sortOrder;

    this.filtersChange.emit(filters);
  }

  onClearFilters(): void {
    this.filterForm.reset({
      sortBy: 'popularity',
      sortOrder: 'desc'
    });
    this.clearFilters.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  get hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return !!(values.genre || values.year || values.minRating || values.maxRating);
  }

  get selectedGenreName(): string | undefined {
    const genreId = this.filterForm.get('genre')?.value;
    const genre = this.genres?.find(g => g.id == genreId);
    return genre?.name;
  }
}
