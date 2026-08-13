import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedefinicaoSenha } from './redefinicao-senha';

describe('RedefinicaoSenha', () => {
  let component: RedefinicaoSenha;
  let fixture: ComponentFixture<RedefinicaoSenha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedefinicaoSenha],
    }).compileComponents();

    fixture = TestBed.createComponent(RedefinicaoSenha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
