import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthStore } from '../../shared/auth-store.service';
import { SideBar } from './side-bar';

describe('SideBar', () => {
  let component: SideBar;
  let fixture: ComponentFixture<SideBar>;
  let auth: AuthStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBar],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(AuthStore);
    auth.logout();

    fixture = TestBed.createComponent(SideBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show only public groups for visitors', () => {
    const titles = component.groups().map((group) => group.title);

    expect(titles).toContain('Pagina publica');
    expect(titles).toContain('Sites secundarios');
    expect(titles).toContain('Legal');
    expect(titles).not.toContain('Area do usuario');
    expect(titles).not.toContain('Area da ONG');
    expect(titles).not.toContain('Administracao');
  });

  it('should show public and ONG groups for ONG sessions', () => {
    auth.session.set({
      id: 'ong-1',
      perfil: 'ong',
      nome: 'ONG Teste',
      email: 'ong@teste.com',
      iniciadoEm: new Date(0).toISOString(),
    });

    const titles = component.groups().map((group) => group.title);

    expect(titles).toContain('Pagina publica');
    expect(titles).toContain('Area da ONG');
    expect(titles).toContain('Legal');
    expect(titles).not.toContain('Area do usuario');
    expect(titles).not.toContain('Administracao');
  });
});
