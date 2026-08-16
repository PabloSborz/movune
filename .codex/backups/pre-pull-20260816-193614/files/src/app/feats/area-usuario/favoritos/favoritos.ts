import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { AuthStore } from '../../../shared/auth-store.service';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-favoritos',
  imports: [FeaturePage],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  private readonly activity = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);

  readonly page = computed(() => {
    const session = this.auth.session();
    const favoritos = this.activity
      .byType('favorito')
      .filter((record) => !session || record.ownerId === session.id)
      .map((record) => ({
        title: record.fields['Titulo'] || record.pageTitle,
        meta: record.fields['Categoria'] || 'Favorito',
        description: record.fields['Descricao'] || 'Item salvo na sua area.',
        tags: [record.status, this.formatDate(record.createdAt)],
        href: record.fields['Link'] || undefined,
      }));

    return {
      ...PAGE_CONTENT.favoritos,
      cards: [...favoritos, ...PAGE_CONTENT.favoritos.cards],
    };
  });

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  }
}
