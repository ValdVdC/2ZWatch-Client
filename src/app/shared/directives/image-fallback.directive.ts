import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  @Input() fallbackType: 'poster' | 'backdrop' | 'profile' | 'avatar' = 'poster';
  @Input() showIcon: boolean = true;
  
  private hasError = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('error')
  onError() {
    if (this.hasError) return;
    this.hasError = true;
    
    const img = this.el.nativeElement;
    const parent = img.parentElement;
    
    if (!parent) return;

    // Remove a imagem
    this.renderer.setStyle(img, 'display', 'none');
    
    // Cria o skeleton
    const skeleton = this.renderer.createElement('div');
    this.renderer.addClass(skeleton, 'image-skeleton');
    this.renderer.addClass(skeleton, `skeleton-${this.fallbackType}`);
    
    // Adiciona ícone se necessário
    if (this.showIcon) {
      const icon = this.renderer.createElement('i');
      const iconClass = this.getIconClass();
      iconClass.split(' ').forEach(cls => this.renderer.addClass(icon, cls));
      this.renderer.appendChild(skeleton, icon);
    }
    
    // Insere o skeleton
    this.renderer.insertBefore(parent, skeleton, img);
  }

  @HostListener('load')
  onLoad() {
    this.hasError = false;
  }

  private getIconClass(): string {
    switch (this.fallbackType) {
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
}
