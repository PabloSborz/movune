import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesProjeto } from './detalhes-projeto';

describe('DetalhesProjeto', () => {
  let component: DetalhesProjeto;
  let fixture: ComponentFixture<DetalhesProjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesProjeto],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesProjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
