import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarVagaOng } from './gerenciar-vaga-ong';

describe('GerenciarVagaOng', () => {
  let component: GerenciarVagaOng;
  let fixture: ComponentFixture<GerenciarVagaOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarVagaOng],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarVagaOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
