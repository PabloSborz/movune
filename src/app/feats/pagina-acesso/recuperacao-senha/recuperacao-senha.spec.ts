import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RecuperacaoSenha } from './recuperacao-senha';

describe('RecuperacaoSenha', () => {
  let component: RecuperacaoSenha;
  let fixture: ComponentFixture<RecuperacaoSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperacaoSenha],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperacaoSenha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
