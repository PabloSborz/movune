import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEventos } from './detalhes-eventos';

describe('DetalhesEventos', () => {
  let component: DetalhesEventos;
  let fixture: ComponentFixture<DetalhesEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
