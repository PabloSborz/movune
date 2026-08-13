import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarConteudo } from './gerenciar-conteudo';

describe('GerenciarConteudo', () => {
  let component: GerenciarConteudo;
  let fixture: ComponentFixture<GerenciarConteudo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarConteudo],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarConteudo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
