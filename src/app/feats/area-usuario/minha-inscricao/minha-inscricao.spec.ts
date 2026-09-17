import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MinhaInscricao } from './minha-inscricao';

describe('MinhaInscricao', () => {
  let component: MinhaInscricao;
  let fixture: ComponentFixture<MinhaInscricao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaInscricao],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaInscricao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('combines type and status filters', () => {
    component.typeFilter = 'Evento';
    component.statusFilter = 'Pendente';
    expect(component.filteredRows.map((row) => row.activity)).toEqual(['Mutirão de arrecadação']);
  });

  it('marks an example as cancelled after confirmation', async () => {
    component.cancelPending = component.rows[0];
    component.confirmCancel();
    await new Promise((resolve) => setTimeout(resolve, 220));
    expect(component.rows[0].status).toBe('Cancelada');
  });
});
