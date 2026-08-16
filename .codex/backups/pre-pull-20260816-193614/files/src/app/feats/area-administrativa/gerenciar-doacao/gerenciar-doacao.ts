import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-gerenciar-doacao',
  imports: [FeaturePage],
  templateUrl: './gerenciar-doacao.html',
  styleUrl: './gerenciar-doacao.css',
})
export class GerenciarDoacao {
  private readonly activity = inject(SiteActivityStore);

  readonly page = computed(() => {
    const registros = this.activity
      .byType('doacao')
      .map((record) => [
        record.ownerName || record.fields['Dados do doador'] || 'Visitante',
        record.fields['Valor ou item'] || record.fields['Tipo de doacao'] || 'Doacao',
        record.fields['Projeto apoiado'] || record.pageTitle,
        record.status,
      ]);

    return {
      ...PAGE_CONTENT.gerenciarDoacao,
      table: {
        columns: PAGE_CONTENT.gerenciarDoacao.table.columns,
        rows: [...registros, ...PAGE_CONTENT.gerenciarDoacao.table.rows],
      },
    };
  });
}
