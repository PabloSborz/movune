import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { AuthStore } from '../../../shared/auth-store.service';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-minha-inscricao',
  imports: [FeaturePage],
  templateUrl: './minha-inscricao.html',
  styleUrl: './minha-inscricao.css',
})
export class MinhaInscricao {
  private readonly activity = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);

  readonly page = computed(() => {
    const session = this.auth.session();
    const registros = this.activity
      .byType('inscricao')
      .filter((record) => !session || record.ownerId === session.id)
      .map((record) => [
        record.fields['Atividade'] || record.pageTitle,
        record.fields['Tipo'] || 'Inscricao',
        this.formatDate(record.createdAt),
        record.status,
      ]);

    return {
      ...PAGE_CONTENT.minhaInscricao,
      table: {
        columns: PAGE_CONTENT.minhaInscricao.table.columns,
        rows: [...registros, ...PAGE_CONTENT.minhaInscricao.table.rows],
      },
    };
  });

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  }
}
