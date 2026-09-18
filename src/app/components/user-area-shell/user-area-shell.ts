import { ProfileMenu } from '../profile-menu/profile-menu';
import { Component, Input, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStore } from '../../shared/auth-store.service';
import { NavigationHistoryService } from '../../shared/navigation-history.service';

@Component({
  selector: 'app-user-area-shell',
  imports: [ProfileMenu, RouterLink, RouterLinkActive],
  templateUrl: './user-area-shell.html',
  styleUrls: ['./user-area-shell.css', '../back-button/back-button.css'],
})
export class UserAreaShell {
  @Input({ required: true }) title = '';
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly navigationHistory = inject(NavigationHistoryService);
  readonly session = this.auth.session;
  readonly user = computed(() => this.auth.users().find((item) => item.id === this.session()?.id));
  readonly navLinks = [
    { label: 'Como funciona', path: '/como-funciona' },
    { label: 'ONGs', path: '/ongs' },
    { label: 'Projetos', path: '/projetos' },
    { label: 'Voluntariado', path: '/voluntariado' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Empresas', path: '/empresas-parceiras' },
    { label: 'Transparência', path: '/transparencia' },
  ];
  navOpen = false;
  sidebarOpen = false;
  noticeOpen = false;

  get initials(): string {
    return (
      (this.session()?.nome || '')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'MV'
    );
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  voltar(): void {
    this.navigationHistory.back();
  }
}
