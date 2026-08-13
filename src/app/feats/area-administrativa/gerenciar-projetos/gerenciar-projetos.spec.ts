import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarProjetos } from './gerenciar-projetos';

describe('GerenciarProjetos', () => {
  let component: GerenciarProjetos;
  let fixture: ComponentFixture<GerenciarProjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarProjetos],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarProjetos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
