import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestacaoContaOng } from './prestacao-conta-ong';

describe('PrestacaoContaOng', () => {
  let component: PrestacaoContaOng;
  let fixture: ComponentFixture<PrestacaoContaOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestacaoContaOng],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestacaoContaOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
