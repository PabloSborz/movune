import { ProfileMenu } from '../profile-menu/profile-menu';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SideBar } from '../side-bar/side-bar';
import { AccessProfile, AuthStore } from '../../shared/auth-store.service';
import { ChoiceDialogService } from '../../feats/pagina-acesso/escolha/choice-dialog.service';
import { NavigationHistoryService } from '../../shared/navigation-history.service';

@Component({
  selector: 'app-header',
  imports: [ProfileMenu, CommonModule, FormsModule, RouterLink, RouterLinkActive, SideBar],
  templateUrl: './header.html',
  styleUrls: ['./header.css', '../back-button/back-button.css'],
})
export class Header {
  @Input() home = false;
  @Input() authenticatedHome = false;
  homeMenuOpen = false;
  notificationsOpen = false;
  get initials(): string {
    const names = this.session()?.nome.trim().split(/\s+/) || [];
    return ((names[0]?.[0] || '') + (names.length > 1 ? names.at(-1)![0] : '')).toUpperCase();
  }
  readonly homeLinks = [
    { label: 'Como funciona', path: '/como-funciona' },
    { label: 'ONGs', path: '/ongs' },
    { label: 'Projetos', path: '/projetos' },
    { label: 'Voluntariado', path: '/voluntariado' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Empresas', path: '/empresas-parceiras' },
    { label: 'Transparência', path: '/transparencia' },
  ];
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly navigationHistory = inject(NavigationHistoryService);
  private readonly choiceDialog = inject(ChoiceDialogService);

  readonly session = this.auth.session;
  get profilePhoto(): string {
    return this.auth.users().find(user => user.id === this.session()?.id)?.avatar || '';
  }
  get accountRoute(): string {
    return this.session()?.perfil === 'ong' ? '/ong/painel'
      : this.session()?.perfil === 'admin' ? '/admin/painel' : '/usuario/meu-perfil';
  }
  sidebarOpen = false;
  loginAlertOpen = false;

  readonly loginDraft: { email: string; senha: string; perfil: AccessProfile } = {
    email: '',
    senha: '',
    perfil: 'usuario',
  };

  loginFeedback = '';
  readonly loginFieldLocked = { email: true, senha: true };

  voltar(): void {
    this.fecharPaineis();
    this.navigationHistory.back();
  }

  abrirSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.loginAlertOpen = false;
  }

  fecharSidebar(): void {
    this.sidebarOpen = false;
  }

  fecharSidebarDepoisDeNavegar(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLElement && target.closest('a')) {
      this.fecharSidebar();
    }
  }

  abrirLoginAlert(): void {
    this.loginAlertOpen = !this.loginAlertOpen;
    this.sidebarOpen = false;
  }

  fecharLoginAlert(): void {
    this.loginAlertOpen = false;
  }

  entrar(): void {
    const result = this.auth.login({
      perfil: this.loginDraft.perfil,
      identificador: this.loginDraft.email,
      senha: this.loginDraft.senha,
    });

    if (!result.ok) {
      this.loginFeedback = result.message;
      return;
    }

    this.loginFeedback = '';
    this.fecharPaineis();
    void this.router.navigateByUrl(result.route || '/');
  }

  recuperarSenha(): void {
    void this.router.navigate(['/recuperacao-senha'], {
      queryParams: this.loginDraft.email.trim() ? { email: this.loginDraft.email.trim() } : {},
    });
    this.fecharPaineis();
  }

  habilitarLoginField(field: 'email' | 'senha', event: Event): void {
    if (!this.loginFieldLocked[field]) {
      return;
    }

    this.loginFieldLocked[field] = false;
    this.loginDraft[field] = '';

    const input = event.target as HTMLInputElement;
    input.value = '';
    input.removeAttribute('readonly');
  }

  criarConta(): void {
    this.fecharPaineis();
    this.choiceDialog.open(this.accessQueryParams()['email'] || '');
  }

  sair(): void {
    this.auth.logout();
    this.fecharPaineis();
    void this.router.navigateByUrl('/login');
  }

  @HostListener('document:keydown.escape')
  fecharComEscape(): void {
    this.fecharPaineis();
  }

  private accessQueryParams(): Record<string, string> {
    const email = this.loginDraft.email.trim();

    return email ? { perfil: this.loginDraft.perfil, email } : { perfil: this.loginDraft.perfil };
  }

  fecharPaineis(): void {
    this.notificationsOpen = false;
    this.sidebarOpen = false;
    this.loginAlertOpen = false;
    this.loginFeedback = '';
  }
}
