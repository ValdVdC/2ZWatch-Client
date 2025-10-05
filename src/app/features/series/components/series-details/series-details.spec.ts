import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesDetails } from './series-details';

describe('SeriesDetails', () => {
  let component: SeriesDetails;
  let fixture: ComponentFixture<SeriesDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
