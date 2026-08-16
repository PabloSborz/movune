import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SideBar } from '../side-bar/side-bar';
import { AccessProfile, AuthStore } from '../../shared/auth-store.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink, SideBar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  readonly session = this.auth.session;
  sidebarOpen = false;
  loginAlertOpen = false;

  readonly loginDraft: { email: string; perfil: Exclude<AccessProfile, 'admin'> } = {
    email: '',
    perfil: 'usuario',
  };

  readonly primaryLinks = [
    { label: 'Inicio', fragment: 'inicio' },
    { label: 'Como funciona', fragment: 'como-funciona' },
    { label: 'ONGs', fragment: 'ongs' },
    { label: 'Projetos', fragment: 'projetos' },
    { label: 'Voluntariado', fragment: 'voluntariado' },
    { label: 'Eventos', fragment: 'eventos' },
    { label: 'Doacoes', fragment: 'doacoes' },
    { label: 'Impacto', fragment: 'impacto' },
    { label: 'Parceiros', fragment: 'parceiros' },
    { label: 'Transparencia', fragment: 'transparencia' },
    { label: 'Suporte', fragment: 'suporte' },
  ];

  dashboardLabel(profile: AccessProfile): string {
    if (profile === 'admin') {
      return 'Painel admin';
    }

    if (profile === 'ong') {
      return 'Painel ONG';
    }

    return 'Minha area';
  }

  dashboardPath(profile: AccessProfile): string {
    if (profile === 'admin') {
      return '/admin/painel';
    }

    if (profile === 'ong') {
      return '/ong/painel';
    }

    return '/usuario/meu-perfil';
  }

  abrirSidebar(): void {
    this.sidebarOpen = true;
  }

  fecharSidebar(): void {
    this.sidebarOpen = false;
  }

  abrirLoginAlert(): void {
    this.loginAlertOpen = true;
    this.sidebarOpen = false;
  }

  fecharLoginAlert(): void {
    this.loginAlertOpen = false;
  }

  navegarParaAssunto(event: Event, fragment: string): void {
    event.preventDefault();

    void this.router.navigate(['/'], { fragment }).then(() => {
      this.scrollToAssunto(fragment);
    });
  }

  entrar(): void {
    void this.router.navigate(['/login'], {
      queryParams: this.accessQueryParams(),
    });
    this.fecharLoginAlert();
  }

  criarConta(): void {
    const route = this.loginDraft.perfil === 'ong' ? '/cadastro-ong' : '/cadastro-usuario';

    void this.router.navigate([route], {
      queryParams: this.accessQueryParams(),
    });
    this.fecharLoginAlert();
  }

  isActiveFragment(fragment: string): boolean {
    const urlTree = this.router.parseUrl(this.router.url);
    const primaryRoute = urlTree.root.children['primary'];
    const isHome = !primaryRoute || primaryRoute.segments.length === 0;
    const activeFragment = urlTree.fragment || 'inicio';

    return isHome && activeFragment === fragment;
  }

  sair(): void {
    this.auth.logout();
    this.fecharLoginAlert();
    void this.router.navigateByUrl('/login');
  }

  private accessQueryParams(): Record<string, string> {
    const email = this.loginDraft.email.trim();

    return email ? { perfil: this.loginDraft.perfil, email } : { perfil: this.loginDraft.perfil };
  }

  private scrollToAssunto(fragment: string): void {
    const scroll = () => {
      this.document.getElementById(fragment)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    scroll();
    this.document.defaultView?.setTimeout(scroll, 50);
  }
}
