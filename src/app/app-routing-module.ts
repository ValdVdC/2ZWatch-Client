import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Explorer } from './pages/explorer/explorer';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AuthCallback } from './pages/auth-callback/auth-callback';

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
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'auth/callback',
    component: AuthCallback
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movie.module').then(m => m.MoviesModule)
  },
  {
    path: 'series',
    loadChildren: () => import('./features/series/series.module').then(m => m.SeriesModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: 'user/:username',
    loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfileComponent)
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

