import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDoacao } from './politica-doacao';

describe('PoliticaDoacao', () => {
  let component: PoliticaDoacao;
  let fixture: ComponentFixture<PoliticaDoacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaDoacao],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaDoacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
