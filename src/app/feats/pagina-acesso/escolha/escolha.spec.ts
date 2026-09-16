import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Escolha } from './escolha';

describe('Escolha', () => {
  let component: Escolha;
  let fixture: ComponentFixture<Escolha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Escolha],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Escolha);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
