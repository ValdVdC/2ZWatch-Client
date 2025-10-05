import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesDetail } from './series-detail';

describe('SeriesDetail', () => {
  let component: SeriesDetail;
  let fixture: ComponentFixture<SeriesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
