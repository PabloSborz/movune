import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../../../shared/auth-store.service';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accepts the configured administrator email and password', () => {
    const auth = TestBed.inject(AuthStore);
    const result = auth.login({
      perfil: 'admin',
      identificador: 'admin@gmail.com',
      senha: '123456',
    });

    expect(result.ok).toBe(true);
    expect(result.route).toBe('/admin/painel');
    expect(auth.session()?.email).toBe('admin@gmail.com');
  });

  it('rejects the previous administrator credential', () => {
    const auth = TestBed.inject(AuthStore);
    const result = auth.login({ perfil: 'admin', identificador: 'admin', senha: '09876' });
    expect(result.ok).toBe(false);
  });

  it('allows the demo volunteer to access the user profile', () => {
    const auth = TestBed.inject(AuthStore);
    const result = auth.login({
      perfil: 'usuario',
      identificador: 'voluntario@gmail.com',
      senha: '123456',
    });

    expect(result.ok).toBe(true);
    expect(result.route).toBe('/usuario/meu-perfil');
    expect(auth.session()?.nome).toBe('Ana Silva');
  });

  it('allows the demo ONG to access its panel', () => {
    const auth = TestBed.inject(AuthStore);
    const result = auth.login({ perfil: 'ong', identificador: 'ong@gmail.com', senha: '123456' });

    expect(result.ok).toBe(true);
    expect(result.route).toBe('/ong/painel');
    expect(auth.session()?.perfil).toBe('ong');
  });
});
