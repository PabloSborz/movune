import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarProjetoOng } from './cadastrar-projeto-ong';

describe('CadastrarProjetoOng', () => {
  let component: CadastrarProjetoOng;
  let fixture: ComponentFixture<CadastrarProjetoOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarProjetoOng],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarProjetoOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
