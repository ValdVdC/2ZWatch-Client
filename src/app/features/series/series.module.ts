import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { MediaActionsComponent } from '../../shared/components/media-actions/media-actions';
import { RatingComponent } from '../../shared/components/rating/rating';
import { CommentsComponent } from '../../shared/components/comments/comments';

// Componentes

import { SeriesCard } from './components/series-card/series-card';
import { SeriesFilter } from './components/series-filter/series-filter';
import { SeriesList } from './components/series-list/series-list';
import { SeriesDetails } from './components/series-details/series-details';
import { SeasonDetailsComponent } from './components/season-details/season-details';
import { EpisodeDetailsComponent } from './components/episode-details/episode-details';

// Páginas

import { SeriesHome } from './pages/series-home/series-home';
import { SeriesSearch } from './pages/series-search/series-search';
import { SeriesDetail } from './pages/series-detail/series-detail';

// Resolvers

import { SeriesDetailResolver } from './resolvers/series-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: SeriesHome
  },
  {
    path: 'search',
    component: SeriesSearch
  },
  {
    path: ':id',
    component: SeriesDetail,
    resolve: {
      series: SeriesDetailResolver
    }
  },
  {
    path: ':id/season/:seasonNumber',
    component: SeasonDetailsComponent
  },
  {
    path: ':id/season/:seasonNumber/episode/:episodeNumber',
    component: EpisodeDetailsComponent
  }
];

@NgModule({
  declarations: [
    SeriesCard,
    SeriesList,
    SeriesDetails,
    SeriesFilter,
    SeriesHome,
    SeriesSearch,
    SeriesDetail,
    SeasonDetailsComponent,
    EpisodeDetailsComponent
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
export class SeriesModule { }