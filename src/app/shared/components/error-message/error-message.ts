import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppError, ErrorHandlerService } from '../../../core/services/error-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-error-message',
  standalone: false,
  templateUrl: './error-message.html',
  styleUrl: './error-message.css'
})
export class ErrorMessage implements OnInit, OnDestroy {
  errors: AppError[] = [];
  private subscription!: Subscription;

  constructor(private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.subscription = this.errorHandler.errors$.subscribe(errors => {
      this.errors = errors;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeError(timestamp: number): void {
    this.errorHandler.removeError(timestamp);
  }

  getErrorIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '✕';
    }
  }
}
