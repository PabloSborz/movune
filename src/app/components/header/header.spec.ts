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
