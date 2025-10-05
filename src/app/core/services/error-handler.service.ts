import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppError {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorsSubject = new BehaviorSubject<AppError[]>([]);
  public errors$ = this.errorsSubject.asObservable();

  handleError(error: any, customMessage?: string): void {
    const errorMessage = customMessage || this.extractErrorMessage(error);
    
    const appError: AppError = {
      message: errorMessage,
      type: 'error',
      timestamp: Date.now()
    };

    this.addError(appError);
    console.error('App Error:', error);
  }

  showSuccess(message: string): void {
    const successError: AppError = {
      message,
      type: 'success',
      timestamp: Date.now()
    };
    this.addError(successError);
  }

  showWarning(message: string): void {
    const warningError: AppError = {
      message,
      type: 'warning',
      timestamp: Date.now()
    };
    this.addError(warningError);
  }

  private addError(error: AppError): void {
    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, error]);

    // Remove após 5 segundos
    setTimeout(() => {
      this.removeError(error.timestamp);
    }, 5000);
  }

  removeError(timestamp: number): void {
    const currentErrors = this.errorsSubject.value;
    const filteredErrors = currentErrors.filter(e => e.timestamp !== timestamp);
    this.errorsSubject.next(filteredErrors);
  }

  clearAll(): void {
    this.errorsSubject.next([]);
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    return 'Ocorreu um erro inesperado';
  }
}