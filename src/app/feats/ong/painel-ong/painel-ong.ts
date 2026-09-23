import { Component, ElementRef, DestroyRef, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-painel-ong',
  templateUrl: './painel-ong.html',
  styleUrl: './painel-ong.css',
})
export class PainelOng {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  protected homeRoute(): string { return this.auth.session()?.perfil === 'ong' ? '/ong/painel' : '/'; }
  private readonly destroy = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.initialize());
  }

  private initialize(): void {
    const root = this.host.nativeElement;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const drawer = root.querySelector<HTMLDialogElement>('#mobile-navigation')!;
    const logout = root.querySelector<HTMLDialogElement>('#logout-dialog')!;
    let returnFocus: HTMLElement | null = null;
    const closePopovers = () => root.querySelectorAll<HTMLElement>('[data-popover]').forEach(panel => {
      panel.hidden = true;
      root.querySelector('[aria-controls="' + panel.id + '"]')?.setAttribute('aria-expanded', 'false');
    });
    root.addEventListener('click', event => {
      const target = event.target as Element;
      const trigger = target.closest<HTMLElement>('[data-toggle]');
      if (trigger?.dataset['toggle'] === 'profile-menu' && !this.auth.session()) {
        void this.router.navigateByUrl('/');
        return;
      }
      if (trigger) {
        const panel = root.querySelector<HTMLElement>('#' + trigger.dataset['toggle'])!;
        const shouldOpen = panel.hidden;
        closePopovers();
        panel.hidden = !shouldOpen;
        trigger.setAttribute('aria-expanded', String(shouldOpen));
        if (shouldOpen) panel.querySelector<HTMLElement>('a, button')?.focus();
      } else if (!target.closest('[data-popover]')) closePopovers();
      if (target.closest('[data-drawer]')) drawer.showModal();
      if (target.closest('[data-close-drawer]') || target === drawer) drawer.close();
      const exit = target.closest<HTMLElement>('[data-logout]');
      if (exit) {
        returnFocus = drawer.open ? root.querySelector<HTMLElement>('[data-drawer]') : exit;
        drawer.close();
        closePopovers();
        logout.showModal();
      }
      if (target.closest('[data-cancel-logout]') || target === logout) logout.close();
      if (target.closest('[data-confirm-logout]')) {
        logout.close();
        this.auth.logout();
        void this.router.navigateByUrl('/login');
      }
      const link = target.closest<HTMLAnchorElement>('a[data-route]');
      const mouse = event as MouseEvent;
      if (link && !mouse.ctrlKey && !mouse.metaKey && !mouse.shiftKey && !mouse.altKey && mouse.button === 0) {
        event.preventDefault();
        root.querySelectorAll('.nav-item').forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === link.getAttribute('href'));
          item.removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'page');
        drawer.close();
        void this.router.navigateByUrl(link.getAttribute('href')!);
      }
    }, options);
    root.ownerDocument.addEventListener('click', event => {
      if (!root.contains(event.target as Node)) closePopovers();
    }, options);
    root.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const open = root.querySelector<HTMLElement>('[data-popover]:not([hidden])');
        if (open) root.querySelector<HTMLElement>('[aria-controls="' + open.id + '"]')?.focus();
        closePopovers();
      }
    }, options);
    drawer.addEventListener('close', () => root.querySelector<HTMLElement>('[data-drawer]')?.focus(), options);
    logout.addEventListener('close', () => returnFocus?.focus(), options);
    // Native dialogs provide focus trapping, Escape dismissal and an inert background.
    const mobileMenu = root.querySelector('#desktop-menu')!.cloneNode(true) as HTMLElement;
    mobileMenu.removeAttribute('id');
    drawer.querySelector('[data-mobile-menu]')!.append(mobileMenu);
    const media = window.matchMedia('(min-width: 1025px)');
    media.addEventListener('change', () => { if (media.matches) drawer.close(); }, options);
    const counters = root.querySelectorAll<HTMLElement>('[data-count]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = reduced ? 1 : Math.min((now - start) / 1000, 1);
      counters.forEach(counter => {
        const value = Math.round(Number(counter.dataset['count']) * progress);
        counter.textContent = (counter.dataset['currency'] ? 'R$ ' : '') + value.toLocaleString('pt-BR');
      });
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    this.destroy.onDestroy(() => { controller.abort(); cancelAnimationFrame(frame); drawer.close(); logout.close(); });
  }
}
