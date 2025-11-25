import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-account-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-account-modal.html',
  styleUrls: ['./delete-account-modal.css']
})
export class DeleteAccountModalComponent {
  @Input() isOpen = false;
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordsMatch = false;
  canConfirm = false;

  validatePasswords(): void {
    this.passwordsMatch = this.password === this.confirmPassword && this.password.length > 0;
    this.canConfirm = this.passwordsMatch && this.password.length >= 6;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onConfirm(): void {
    if (this.canConfirm) {
      this.confirm.emit(this.password);
      this.resetForm();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  private resetForm(): void {
    this.password = '';
    this.confirmPassword = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.passwordsMatch = false;
    this.canConfirm = false;
  }
}
