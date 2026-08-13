import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarDoacao } from './gerenciar-doacao';

describe('GerenciarDoacao', () => {
  let component: GerenciarDoacao;
  let fixture: ComponentFixture<GerenciarDoacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarDoacao],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarDoacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
