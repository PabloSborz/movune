import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

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

  it('keeps public home actions even with an active session', () => {
    fixture.componentRef.setInput('home', true);
    component.session.set({ id: 'test', perfil: 'usuario', nome: 'Teste', email: 'teste@example.com', iniciadoEm: '' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/login"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/escolha"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.landing-brand').getAttribute('href')).toBe('/inicio');
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
