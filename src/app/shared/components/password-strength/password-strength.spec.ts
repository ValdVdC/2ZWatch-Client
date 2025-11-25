import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordStrengthComponent } from './password-strength';

describe('PasswordStrengthComponent', () => {
  let component: PasswordStrengthComponent;
  let fixture: ComponentFixture<PasswordStrengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordStrengthComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate weak password', () => {
    component.password = '123';
    component.ngOnChanges({
      password: {
        currentValue: '123',
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.strength.score).toBeLessThan(2);
  });

  it('should evaluate strong password', () => {
    component.password = 'MyP@ssw0rd123!';
    component.ngOnChanges({
      password: {
        currentValue: 'MyP@ssw0rd123!',
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.strength.score).toBeGreaterThanOrEqual(3);
  });
});
