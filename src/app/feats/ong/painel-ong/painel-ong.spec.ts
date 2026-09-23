import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, afterEach } from 'vitest';

import { PainelOng } from './painel-ong';
import { AuthStore } from '../../../shared/auth-store.service';
import { Router } from '@angular/router';

describe('PainelOng', () => {
  let component: PainelOng;
  let fixture: ComponentFixture<PainelOng>;

  beforeEach(async () => {
    // jsdom does not implement media queries or native modal dialogs.
    vi.stubGlobal('matchMedia', () => ({
      matches: false, addEventListener: () => {}, removeEventListener: () => {},
    }));
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: function (this: HTMLDialogElement) { this.open = true; },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        if (this.open) { this.open = false; this.dispatchEvent(new Event('close')); }
      },
    });
    await TestBed.configureTestingModule({
      imports: [PainelOng],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelOng);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens one dropdown at a time and closes it with Escape', () => {
    TestBed.inject(AuthStore).session.set({ id: 'ong-test', perfil: 'ong', nome: 'ONG', email: 'ong@example.com', iniciadoEm: '' });
    const root: HTMLElement = fixture.nativeElement;
    const bell = root.querySelector<HTMLButtonElement>('[data-toggle="notifications"]')!;
    const avatar = root.querySelector<HTMLButtonElement>('[data-toggle="profile-menu"]')!;
    bell.click();
    expect(root.querySelector<HTMLElement>('#notifications')!.hidden).toBe(false);
    expect(bell.getAttribute('aria-expanded')).toBe('true');
    avatar.click();
    expect(root.querySelector<HTMLElement>('#notifications')!.hidden).toBe(true);
    expect(root.querySelector<HTMLElement>('#profile-menu')!.hidden).toBe(false);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(root.querySelector<HTMLElement>('#profile-menu')!.hidden).toBe(true);
    expect(avatar.getAttribute('aria-expanded')).toBe('false');
  });

  it('sends visitors to the public home from the logo and avatar', () => {
    TestBed.inject(AuthStore).session.set(null);
    fixture.detectChanges();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.logo-group a')!.getAttribute('href')).toBe('/');
    root.querySelector<HTMLButtonElement>('[data-toggle="profile-menu"]')!.click();
    expect(navigate).toHaveBeenCalledWith('/');
    navigate.mockRestore();
  });

  it('navigates directly to the ONG home when its profile image is clicked', () => {
    TestBed.inject(AuthStore).session.set({ id: 'ong-test', perfil: 'ong', nome: 'ONG', email: 'ong@example.com', iniciadoEm: '' });
    fixture.detectChanges();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('a.avatar')!.getAttribute('href')).toBe('/ong/painel');
    root.querySelector<HTMLElement>('a.avatar img')!.click();
    expect(navigate).toHaveBeenCalledWith('/ong/painel');
    expect(root.querySelector<HTMLElement>('#profile-menu')!.hidden).toBe(true);
    navigate.mockRestore();
  });

  it('requires confirmation before leaving and allows cancellation', () => {
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('.left-sidebar [data-logout]')!.click();
    const dialog = root.querySelector<HTMLDialogElement>('#logout-dialog')!;
    expect(dialog.open).toBe(true);
    root.querySelector<HTMLButtonElement>('[data-cancel-logout]')!.click();
    expect(dialog.open).toBe(false);
  });

  it('opens and closes the mobile navigation with all ten destinations', () => {
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('[data-drawer]')!.click();
    const dialog = root.querySelector<HTMLDialogElement>('#mobile-navigation')!;
    expect(dialog.open).toBe(true);
    expect(dialog.querySelectorAll('a[data-route]').length).toBe(10);
    root.querySelector<HTMLButtonElement>('[data-close-drawer]')!.click();
    expect(dialog.open).toBe(false);
  });
});
