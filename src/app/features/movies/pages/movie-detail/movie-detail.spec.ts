import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetail } from './movie-detail';

describe('MovieDetail', () => {
  let component: MovieDetail;
  let fixture: ComponentFixture<MovieDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
