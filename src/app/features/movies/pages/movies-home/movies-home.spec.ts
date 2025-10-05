import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesHome } from './movies-home';

describe('MoviesHome', () => {
  let component: MoviesHome;
  let fixture: ComponentFixture<MoviesHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoviesHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
