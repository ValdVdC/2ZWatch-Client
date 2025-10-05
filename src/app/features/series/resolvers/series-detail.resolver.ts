import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { SeriesService } from '../services/series.service';
import { SeriesDetail } from '../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesDetailResolver implements Resolve<SeriesDetail | null> {

  constructor(private seriesService: SeriesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SeriesDetail | null> {
    const seriesId = Number(route.paramMap.get('id'));
    
    if (!seriesId || isNaN(seriesId)) {
      return of(null);
    }

    return this.seriesService.getSeriesDetails(seriesId).pipe(
      catchError(error => {
        console.error('Error loading series details:', error);
        return of(null);
      })
    );
  }
}