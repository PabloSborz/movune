import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MinhaDoacao } from './minha-doacao';

describe('MinhaDoacao', () => {
  let component: MinhaDoacao;
  let fixture: ComponentFixture<MinhaDoacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaDoacao],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaDoacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates the example donation metrics', () => {
    expect(component.totalDonated).toBe('R$ 1.250');
    expect(component.supportedProjects).toBe(4);
    expect(component.latestDonation.month).toBe('Set/2026');
  });

  it('sorts donations by value', () => {
    component.sort('amount');
    expect(component.rows[0].amount).toBe('R$ 200');
    component.sort('amount');
    expect(component.rows[0].amount).toBe('R$ 500');
  });
});
