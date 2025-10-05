import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesFilter } from './series-filter';

describe('SeriesFilter', () => {
  let component: SeriesFilter;
  let fixture: ComponentFixture<SeriesFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
