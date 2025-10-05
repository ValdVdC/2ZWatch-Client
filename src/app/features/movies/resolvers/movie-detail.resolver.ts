import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { MovieDetail } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailResolver implements Resolve<MovieDetail | null> {

  constructor(private movieService: MovieService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MovieDetail | null> {
    const movieId = Number(route.paramMap.get('id'));
    
    if (!movieId || isNaN(movieId)) {
      return of(null);
    }

    return this.movieService.getMovieDetails(movieId).pipe(
      catchError(error => {
        console.error('Error loading movie details:', error);
        return of(null);
      })
    );
  }
}