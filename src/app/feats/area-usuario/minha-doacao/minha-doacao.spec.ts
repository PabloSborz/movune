import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhaDoacao } from './minha-doacao';

describe('MinhaDoacao', () => {
  let component: MinhaDoacao;
  let fixture: ComponentFixture<MinhaDoacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaDoacao],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaDoacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
