import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  standalone: false
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'GitHub', url: '#', icon: 'github' },
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'Instagram', url: '#', icon: 'instagram' }
  ];

  quickLinks = [
    { name: 'Filmes', url: '/movies' },
    { name: 'Séries', url: '/series' },
    { name: 'Buscar', url: '/search' },
    { name: 'Sobre', url: '/about' }
  ];

}