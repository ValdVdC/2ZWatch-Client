import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

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
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() filterToggle = new EventEmitter<void>();

  searchControl = new FormControl('');
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;
  isFocused = false;

  ngOnInit(): void {
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
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onClear(): void {
    this.searchControl.setValue('');
    this.clear.emit();
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
  }

  onFilterClick(): void {
    this.filterToggle.emit();
  }

  get hasValue(): boolean {
    return !!this.searchControl.value;
  }
}
