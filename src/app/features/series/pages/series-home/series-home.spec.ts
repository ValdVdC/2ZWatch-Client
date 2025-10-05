import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesHome } from './series-home';

describe('SeriesHome', () => {
  let component: SeriesHome;
  let fixture: ComponentFixture<SeriesHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
