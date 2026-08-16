import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { AuthStore, MovuneOng } from '../../../shared/auth-store.service';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-ongs',
  imports: [CommonModule, FeaturePage],
  templateUrl: './gerenciar-ongs.html',
  styleUrls: ['../admin-management.css', './gerenciar-ongs.css'],
})
export class GerenciarOngs {
  private readonly auth = inject(AuthStore);

  readonly page = { ...PAGE_CONTENT.gerenciarOngs, table: undefined };
  readonly ongs = this.auth.ongs;

  formatDate(value?: string): string {
    if (!value) {
      return 'Nunca';
    }

    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  }

  aprovarOng(ong: MovuneOng): void {
    this.auth.updateOngStatus(ong.id, 'Aprovada');
  }

  alternarSuspensao(ong: MovuneOng): void {
    this.auth.updateOngStatus(ong.id, ong.status === 'Suspensa' ? 'Em analise' : 'Suspensa');
  }

  removerOng(id: string): void {
    this.auth.removeOng(id);
  }
}
