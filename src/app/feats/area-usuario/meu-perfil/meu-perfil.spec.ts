import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MeuPerfil } from './meu-perfil';

describe('MeuPerfil', () => {
  let component: MeuPerfil;
  let fixture: ComponentFixture<MeuPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeuPerfil],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MeuPerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
