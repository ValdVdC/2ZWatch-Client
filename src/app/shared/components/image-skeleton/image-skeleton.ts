import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-skeleton.html',
  styleUrls: ['./image-skeleton.css']
})
export class ImageSkeletonComponent {
  @Input() type: 'poster' | 'backdrop' | 'profile' | 'avatar' = 'poster';
  @Input() showIcon: boolean = true;
  @Input() aspectRatio: string = '2/3'; // poster padrão
  
  get iconClass(): string {
    switch (this.type) {
      case 'poster':
      case 'backdrop':
        return 'bi bi-film';
      case 'profile':
      case 'avatar':
        return 'bi bi-person-circle';
      default:
        return 'bi bi-image';
    }
  }

  get skeletonClass(): string {
    return `skeleton-${this.type}`;
  }
}
