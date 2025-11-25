import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { MediaActionsComponent } from '../../shared/components/media-actions/media-actions';
import { RatingComponent } from '../../shared/components/rating/rating';
import { CommentsComponent } from '../../shared/components/comments/comments';

// Componentes

import { MovieCard } from './components/movie-card/movie-card';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetails } from './components/movie-details/movie-details';
import { MovieFilter } from './components/movie-filter/movie-filter';

// Páginas

import { MoviesHome } from './pages/movies-home/movies-home';
import { MoviesSearch } from './pages/movies-search/movies-search';
import { MovieDetail } from './pages/movie-detail/movie-detail';

// Resolvers

import { MovieDetailResolver } from './resolvers/movie-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: MoviesHome
  },
  {
    path: 'search',
    component: MoviesSearch
  },
  {
    path: ':id',
    component: MovieDetail,
    resolve: {
      movie: MovieDetailResolver
    }
  }
];

@NgModule({
  declarations: [
    MovieCard,
    MovieList,
    MovieDetails,
    MovieFilter,
    MoviesHome,
    MoviesSearch,
    MovieDetail,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MediaActionsComponent,
    RatingComponent,
    CommentsComponent
  ],
  exports: [
    
  ]
})
export class MoviesModule { }