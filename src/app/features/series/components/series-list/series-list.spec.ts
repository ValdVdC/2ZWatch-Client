import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesList } from './series-list';

describe('SeriesList', () => {
  let component: SeriesList;
  let fixture: ComponentFixture<SeriesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
