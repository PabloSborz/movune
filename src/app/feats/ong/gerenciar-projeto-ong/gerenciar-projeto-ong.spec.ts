import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarProjetoOng } from './gerenciar-projeto-ong';

describe('GerenciarProjetoOng', () => {
  let component: GerenciarProjetoOng;
  let fixture: ComponentFixture<GerenciarProjetoOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarProjetoOng],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarProjetoOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
