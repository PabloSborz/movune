import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalheVagaVoluntario } from './detalhe-vaga-voluntario';

describe('DetalheVagaVoluntario', () => {
  let component: DetalheVagaVoluntario;
  let fixture: ComponentFixture<DetalheVagaVoluntario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheVagaVoluntario],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheVagaVoluntario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
