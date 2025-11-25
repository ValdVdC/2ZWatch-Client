import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PasswordValidator, PasswordStrength } from '../../validators/password-validator';

@Component({
  selector: 'app-password-strength',
  standalone: false,
  templateUrl: './password-strength.html',
  styleUrls: ['./password-strength.css']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password: string = '';
  @Input() showFeedback: boolean = true;

  strength: PasswordStrength = {
    score: 0,
    label: '',
    color: '#e5e7eb',
    percentage: 0,
    feedback: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password'] && this.password) {
      this.strength = PasswordValidator.validate(this.password);
    } else if (!this.password) {
      this.strength = {
        score: 0,
        label: '',
        color: '#e5e7eb',
        percentage: 0,
        feedback: []
      };
    }
  }
}
