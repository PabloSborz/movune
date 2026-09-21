import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, afterEach } from 'vitest';

import { PainelOng } from './painel-ong';

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

  it('requires confirmation before leaving and allows cancellation', () => {
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('.left-sidebar [data-logout]')!.click();
    const dialog = root.querySelector<HTMLDialogElement>('#logout-dialog')!;
    expect(dialog.open).toBe(true);
    root.querySelector<HTMLButtonElement>('[data-cancel-logout]')!.click();
    expect(dialog.open).toBe(false);
  });

  it('opens and closes the mobile navigation with all eleven destinations', () => {
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('[data-drawer]')!.click();
    const dialog = root.querySelector<HTMLDialogElement>('#mobile-navigation')!;
    expect(dialog.open).toBe(true);
    expect(dialog.querySelectorAll('a[data-route]').length).toBe(11);
    root.querySelector<HTMLButtonElement>('[data-close-drawer]')!.click();
    expect(dialog.open).toBe(false);
  });
});
