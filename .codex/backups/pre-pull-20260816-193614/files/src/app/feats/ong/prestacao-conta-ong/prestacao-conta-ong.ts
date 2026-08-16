import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-prestacao-conta-ong',
  imports: [FeaturePage],
  templateUrl: './prestacao-conta-ong.html',
  styleUrl: './prestacao-conta-ong.css',
})
export class PrestacaoContaOng {
  private readonly activity = inject(SiteActivityStore);

  readonly page = computed(() => {
    const registros = this.activity
      .byType('prestacao')
      .map((record) => [
        record.fields['Descricao'] || record.fields['Tipo de lancamento'] || record.pageTitle,
        record.fields['Projeto vinculado'] || 'Sem projeto',
        record.fields['Valor'] || 'A conferir',
        record.status,
      ]);

    return {
      ...PAGE_CONTENT.prestacaoContaOng,
      table: {
        columns: PAGE_CONTENT.prestacaoContaOng.table.columns,
        rows: [...registros, ...PAGE_CONTENT.prestacaoContaOng.table.rows],
      },
    };
  });
}
