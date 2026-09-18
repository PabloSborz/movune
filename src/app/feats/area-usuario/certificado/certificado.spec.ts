import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Certificado } from './certificado';

describe('Certificado', () => {
  let component: Certificado;
  let fixture: ComponentFixture<Certificado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Certificado],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Certificado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('offers downloads only for validated certificates', () => {
    expect(fixture.nativeElement.querySelectorAll('.download').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.pending-card .download')).toBeNull();
    fixture.nativeElement.querySelector('.download').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Mentoria de carreira');
    expect(component.toast()).toContain('simulação');
  });

  it('shows empty states when there are no certificates', () => {
    component.available.set([]);
    component.pending.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.empty').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.download')).toBeNull();
  });
});
