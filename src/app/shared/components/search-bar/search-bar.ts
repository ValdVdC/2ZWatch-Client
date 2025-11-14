import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

export interface SearchSuggestion {
  id: number;
  title: string;
  type: 'movie' | 'series' | 'person';
  year?: string;
  poster?: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit, OnDestroy{
  @Input() placeholder: string = 'Buscar filmes e séries...';
  @Input() debounceTime: number = 300;
  @Input() minLength: number = 2;
  @Input() showFilters: boolean = false;
  @Input() initialValue: string = '';
  @Input() suggestions: SearchSuggestion[] = [];
  @Input() showSuggestions: boolean = true;
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() filterToggle = new EventEmitter<void>();
  @Output() suggestionSelected = new EventEmitter<SearchSuggestion>();

  searchControl = new FormControl('');
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;
  isFocused = false;
  showDropdown = false;
  searchHistory: string[] = [];
  private readonly HISTORY_KEY = 'search_history';
  private readonly MAX_HISTORY = 5;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Load search history from localStorage
    this.loadSearchHistory();

    // Set initial value if provided
    if (this.initialValue) {
      this.searchControl.setValue(this.initialValue);
    }

    // Subscribe to search changes with debounce
    this.subscription = this.searchSubject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm.length >= this.minLength || searchTerm.length === 0) {
        this.search.emit(searchTerm);
      }
    });

    // Subscribe to form control changes
    this.searchControl.valueChanges.subscribe(value => {
      this.searchSubject.next(value || '');
      if (value && value.length >= this.minLength) {
        this.showDropdown = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  onClear(): void {
    this.searchControl.setValue('');
    this.showDropdown = false;
    this.clear.emit();
  }

  onFocus(): void {
    this.isFocused = true;
    const value = this.searchControl.value;
    if ((value && value.length >= this.minLength) || this.searchHistory.length > 0) {
      this.showDropdown = true;
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.isFocused = false;
    }, 200);
  }

  onFilterClick(): void {
    this.filterToggle.emit();
  }

  onSearchSubmit(): void {
    const value = this.searchControl.value;
    if (value && value.trim()) {
      this.addToHistory(value.trim());
      this.search.emit(value.trim());
      this.showDropdown = false;
    }
  }

  onSuggestionClick(suggestion: SearchSuggestion): void {
    this.searchControl.setValue(suggestion.title);
    this.addToHistory(suggestion.title);
    this.suggestionSelected.emit(suggestion);
    this.showDropdown = false;
  }

  onHistoryItemClick(term: string): void {
    this.searchControl.setValue(term);
    this.search.emit(term);
    this.showDropdown = false;
  }

  removeHistoryItem(term: string, event: Event): void {
    event.stopPropagation();
    this.searchHistory = this.searchHistory.filter(item => item !== term);
    this.saveSearchHistory();
  }

  clearHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  private addToHistory(term: string): void {
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== term);
    // Add to beginning
    this.searchHistory.unshift(term);
    // Keep only MAX_HISTORY items
    if (this.searchHistory.length > this.MAX_HISTORY) {
      this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY);
    }
    this.saveSearchHistory();
  }

  private loadSearchHistory(): void {
    try {
      const history = localStorage.getItem(this.HISTORY_KEY);
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Error loading search history:', error);
      this.searchHistory = [];
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  get hasValue(): boolean {
    return !!this.searchControl.value;
  }

  get showHistorySection(): boolean {
    const value = this.searchControl.value || '';
    return this.searchHistory.length > 0 && value.length < this.minLength;
  }

  get showSuggestionsSection(): boolean {
    const value = this.searchControl.value || '';
    return this.suggestions.length > 0 && value.length >= this.minLength;
  }
}
