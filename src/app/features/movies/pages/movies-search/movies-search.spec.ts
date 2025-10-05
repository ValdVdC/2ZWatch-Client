import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesSearch } from './movies-search';

describe('MoviesSearch', () => {
  let component: MoviesSearch;
  let fixture: ComponentFixture<MoviesSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoviesSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
