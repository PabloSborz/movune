import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { AuthStore, MovuneUser } from '../../../shared/auth-store.service';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-usuario',
  imports: [CommonModule, FeaturePage],
  templateUrl: './gerenciar-usuario.html',
  styleUrls: ['../admin-management.css', './gerenciar-usuario.css'],
})
export class GerenciarUsuario {
  private readonly auth = inject(AuthStore);

  readonly page = { ...PAGE_CONTENT.gerenciarUsuario, table: undefined };
  readonly usuarios = this.auth.users;

  formatDate(value?: string): string {
    if (!value) {
      return 'Nunca';
    }

    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  }

  alternarStatus(usuario: MovuneUser): void {
    this.auth.updateUserStatus(usuario.id, usuario.status === 'Ativo' ? 'Bloqueado' : 'Ativo');
  }

  removerUsuario(id: string): void {
    this.auth.removeUser(id);
  }
}
