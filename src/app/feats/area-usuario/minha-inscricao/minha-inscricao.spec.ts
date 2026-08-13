import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhaInscricao } from './minha-inscricao';

describe('MinhaInscricao', () => {
  let component: MinhaInscricao;
  let fixture: ComponentFixture<MinhaInscricao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaInscricao],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhaInscricao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
