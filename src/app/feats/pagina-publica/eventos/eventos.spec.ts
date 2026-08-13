import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eventos } from './eventos';

describe('Eventos', () => {
  let component: Eventos;
  let fixture: ComponentFixture<Eventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eventos],
    }).compileComponents();

    fixture = TestBed.createComponent(Eventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
