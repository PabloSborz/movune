import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroOng } from './cadastro-ong';

describe('CadastroOng', () => {
  let component: CadastroOng;
  let fixture: ComponentFixture<CadastroOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroOng],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
