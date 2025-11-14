import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Explorer } from './pages/explorer/explorer';

const routes: Routes = [
  {
    path: '',
    component:Home
  },
  {
    path: 'explorer',
    component: Explorer
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movie.module').then(m => m.MoviesModule)
  },
  {
    path: 'series',
    loadChildren: () => import('./features/series/series.module').then(m => m.SeriesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

