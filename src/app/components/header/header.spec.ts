import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links the logged-in ONG logo to its home in both header layouts', () => {
    component.session.set({ id: 'ong-test', perfil: 'ong', nome: 'ONG', email: 'ong@example.com', iniciadoEm: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.brand').getAttribute('href')).toBe('/ong/painel');
    fixture.componentRef.setInput('home', true);
    fixture.componentRef.setInput('authenticatedHome', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.landing-brand').getAttribute('href')).toBe('/ong/painel');
  });

  it('opens the ONG profile from its account menu without an edit shortcut', async () => {
    fixture.componentRef.setInput('home', true);
    fixture.componentRef.setInput('authenticatedHome', true);
    component.session.set({ id: 'ong-test', perfil: 'ong', nome: 'ONG', email: 'ong@example.com', iniciadoEm: '' });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('app-profile-menu .avatar').click();
    fixture.detectChanges();
    const menu: HTMLElement = fixture.nativeElement.querySelector('app-profile-menu .popover');
    expect(menu.textContent).not.toContain('Editar perfil');
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    menu.querySelector('button')!.click();
    expect(navigate).toHaveBeenCalledWith('/perfil-ong');
    navigate.mockRestore();
  });

  it('links Transparência and the logo to their current routes', () => {
    fixture.componentRef.setInput('home', true);
    fixture.detectChanges();

    const links = Array.from(fixture.nativeElement.querySelectorAll('a')) as HTMLAnchorElement[];
    expect(links.find((link) => link.textContent?.trim() === 'Transparência')?.pathname).toBe(
      '/transparencia',
    );
    expect(fixture.nativeElement.querySelector('.landing-brand')?.getAttribute('href')).toBe('/');
    expect(fixture.nativeElement.querySelector('.header-back')).toBeFalsy();
  });

  it('keeps the back button outside the home page', () => {
    expect(fixture.nativeElement.querySelector('.header-back')).toBeTruthy();
  });

  it.each(['usuario', 'ong', 'admin'] as const)('keeps the public home logo and actions with an active %s session', perfil => {
    fixture.componentRef.setInput('home', true);
    component.session.set({ id: 'test', perfil, nome: 'Teste', email: 'teste@example.com', iniciadoEm: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/escolha"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.landing-brand').getAttribute('href')).toBe('/');
  });

  it('shows account actions only on the access home', () => {
    fixture.componentRef.setInput('home', true);
    fixture.componentRef.setInput('authenticatedHome', true);
    component.session.set({ id: 'test', perfil: 'usuario', nome: 'Teste', email: 'teste@example.com', iniciadoEm: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/escolha"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.landing-brand').getAttribute('href')).toBe('/inicio');
    expect(fixture.nativeElement.querySelector('.home-profile')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.home-notifications')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Sair');
  });

  it('should toggle the secondary sites drawer', async () => {
    const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('.menu-button');

    menuButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sidebarOpen).toBe(true);
    expect(component.loginAlertOpen).toBe(false);
    expect(fixture.nativeElement.querySelector('#secondary-sites')).toBeTruthy();

    menuButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sidebarOpen).toBe(false);
    expect(fixture.nativeElement.querySelector('#secondary-sites')).toBeFalsy();
  });

  it('should toggle the quick access dialog and close the drawer', async () => {
    const menuButton: HTMLButtonElement = fixture.nativeElement.querySelector('.menu-button');
    const loginButton: HTMLButtonElement = fixture.nativeElement.querySelector('.login-button');

    menuButton.click();
    loginButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sidebarOpen).toBe(false);
    expect(component.loginAlertOpen).toBe(true);
    expect(fixture.nativeElement.querySelector('#quick-access')).toBeTruthy();

    loginButton.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.loginAlertOpen).toBe(false);
  });

  it('should close open panels with Escape handler', () => {
    component.abrirSidebar();
    component.fecharComEscape();
    fixture.detectChanges();

    expect(component.sidebarOpen).toBe(false);
    expect(component.loginAlertOpen).toBe(false);
  });
});
