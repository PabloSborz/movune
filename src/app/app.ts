import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Escolha } from './feats/pagina-acesso/escolha/escolha';
import { ChoiceDialogService } from './feats/pagina-acesso/escolha/choice-dialog.service';
import { NavigationHistoryService } from './shared/navigation-history.service';

@Component({
  selector: 'app-root',
  imports: [Footer, Header, RouterOutlet, Escolha],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly captureRegistration = (event: Event) =>
    this.interceptRegistration(event as MouseEvent);
  protected readonly choiceDialog = inject(ChoiceDialogService);
  protected readonly isHome = signal(true);
  protected readonly isAuthenticatedHome = signal(false);
  protected readonly isLogin = signal(false);
  protected readonly isAccessPage = signal(false);

  constructor() {
    inject(NavigationHistoryService);
    this.document.addEventListener('click', this.captureRegistration, true);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.choiceDialog.close();
        this.isAuthenticatedHome.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/inicio');
        this.isHome.set(['/', '/inicio'].includes(event.urlAfterRedirects.split(/[?#]/)[0]));
        this.isLogin.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/login');
        this.isAccessPage.set(
          [
            '/cadastro-usuario',
            '/cadastro-ong',
            '/escolha',
            '/recuperacao-senha',
            '/redefinicao-senha',
            '/area-usuario/perfil',
            '/area-usuario/meu-perfil',
            '/usuario/meu-perfil',
            '/usuario/minhas-inscricoes',
            '/usuario/minhas-doacoes',
            '/usuario/favoritos',
            '/usuario/certificados',
            '/ong/painel',
            '/ong/editar-perfil',
            '/ong/projetos',
            '/perfil-ong',
          ].includes(event.urlAfterRedirects.split(/[?#]/)[0]) || event.urlAfterRedirects.startsWith('/ong/') || /^\/voluntario\/[^/]+\/perfil$/.test(event.urlAfterRedirects.split(/[?#]/)[0]),
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('click', this.captureRegistration, true);
  }

  private interceptRegistration(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = event.target as Element | null;
    const link = target?.closest('a[href]') as HTMLAnchorElement | null;
    if (
      !link ||
      link.closest('app-escolha') ||
      link.target === '_blank' ||
      link.origin !== globalThis.location?.origin
    )
      return;
    if (
      ![
        '/escolha',
        '/cadastro',
        '/escolher-cadastro',
        '/cadastro-usuario',
        '/cadastro-ong',
      ].includes(link.pathname)
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    this.choiceDialog.open(new URL(link.href).searchParams.get('email') || '');
  }
}
