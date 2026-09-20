import { Component, ElementRef, HostListener, Input, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthStore } from '../../shared/auth-store.service';

@Component({
  selector: 'app-profile-menu',
  template: `
    <button #trigger type="button" class="avatar" aria-label="Abrir opções do perfil" [attr.aria-expanded]="open" (click)="open = !open">
      @if (photo) { <img [src]="photo" alt="" /> } @else { {{ initials }} }
    </button>
    @if (open) {
      <nav class="popover" aria-label="Opções do perfil">
        <button type="button" (click)="go(false)">Ver meu perfil</button>
        <button type="button" (click)="go(true)">Editar perfil</button>
        <button type="button" class="logout" (click)="logout()">Sair</button>
      </nav>
    }
  `,
  styles: `
    :host { display: inline-block; position: relative; flex-shrink: 0; }
    .avatar { display: grid; place-items: center; width: 40px; height: 40px; padding: 0; overflow: hidden; border: 2px solid #0259e1; border-radius: 50%; background: #f4f8fe; color: #0259e1; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
    img { width: 100%; height: 100%; object-fit: cover; }
    .popover { position: absolute; z-index: 50; top: calc(100% + 10px); right: 0; width: 180px; padding: 6px; border: 1px solid #d9eaf2; border-radius: 12px; background: white; box-shadow: 0 8px 24px rgb(1 28 83 / 14%); }
    .popover button { display: block; width: 100%; padding: 11px 12px; border: 0; border-radius: 7px; background: white; text-align: left; color: #1e293b; font: inherit; font-size: 14px; cursor: pointer; }
    .popover button:hover { background: #f0f5ff; color: #0259e1; }
    .popover .logout { color: #ef4444; border-top: 1px solid #edf2f7; }
    button:focus-visible { outline: 2px solid #0259e1; outline-offset: 2px; }
  `,
})
export class ProfileMenu {
  @Input() photo = '';
  @Input() initials = '';
  open = false;
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  @HostListener('document:click', ['$event'])
  outside(event: Event): void {
    if (!this.host.nativeElement.contains(event.target)) this.open = false;
  }
  @HostListener('document:keydown.escape')
  close(): void {
    if (!this.open) return;
    this.open = false;
    this.trigger()?.nativeElement.focus();
  }
  async go(edit: boolean): Promise<void> {
    this.open = false;
    const profile = this.auth.session()?.perfil;
    const route = profile === 'ong'
      ? (edit ? '/ong/editar-perfil' : '/ong/painel')
      : profile === 'admin'
        ? '/admin/painel'
        : edit
          ? '/area-usuario/meu-perfil'
          : '/area-usuario/perfil';
    await this.router.navigateByUrl(route);
    if (edit && profile === 'usuario') {
      setTimeout(() => {
        const input = this.document.querySelector<HTMLInputElement>('app-meu-perfil input[name="nome"]');
        input?.scrollIntoView({ block: 'center' });
        input?.focus({ preventScroll: true });
      });
    }
  }
  logout(): void {
    this.open = false;
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
