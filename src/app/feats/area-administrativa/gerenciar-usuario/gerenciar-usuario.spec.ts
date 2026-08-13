import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarUsuario } from './gerenciar-usuario';

describe('GerenciarUsuario', () => {
  let component: GerenciarUsuario;
  let fixture: ComponentFixture<GerenciarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
