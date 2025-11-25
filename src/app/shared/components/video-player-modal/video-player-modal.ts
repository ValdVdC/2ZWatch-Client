import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player-modal.html',
  styleUrls: ['./video-player-modal.css']
})
export class VideoPlayerModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() videoKey: string = '';
  @Output() close = new EventEmitter<void>();

  videoUrl: SafeResourceUrl = '';
  showIframe = false;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Only update video URL when videoKey actually changes or modal opens
    if (changes['videoKey'] && this.videoKey) {
      const url = `https://www.youtube.com/embed/${this.videoKey}?autoplay=1&rel=0&modestbranding=1`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    
    // Control iframe visibility to prevent reloading
    if (changes['isOpen']) {
      if (this.isOpen) {
        // Hide header and disable body scroll
        this.toggleHeaderAndScroll(true);
        // Small delay to ensure smooth animation
        setTimeout(() => this.showIframe = true, 100);
      } else {
        // Show header and enable body scroll
        this.toggleHeaderAndScroll(false);
        this.showIframe = false;
      }
    }
  }

  private toggleHeaderAndScroll(hide: boolean): void {
    const header = document.querySelector('app-header');
    const body = document.body;
    
    if (hide) {
      // Hide header with animation
      if (header) {
        this.renderer.addClass(header, 'header-hidden');
      }
      // Disable body scroll and hide scrollbar
      this.renderer.addClass(body, 'modal-open');
    } else {
      // Show header
      if (header) {
        this.renderer.removeClass(header, 'header-hidden');
      }
      // Enable body scroll
      this.renderer.removeClass(body, 'modal-open');
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
