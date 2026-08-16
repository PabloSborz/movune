import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-gerencia-doacao-ong',
  imports: [FeaturePage],
  templateUrl: './gerencia-doacao-ong.html',
  styleUrl: './gerencia-doacao-ong.css',
})
export class GerenciaDoacaoOng {
  private readonly activity = inject(SiteActivityStore);

  readonly page = computed(() => {
    const registros = this.activity
      .byType('doacao')
      .map((record) => [
        record.ownerName || record.fields['Dados do doador'] || 'Visitante',
        record.fields['Tipo de doacao'] || 'Doacao',
        record.fields['Projeto apoiado'] || record.pageTitle,
        record.status,
      ]);

    return {
      ...PAGE_CONTENT.gerenciaDoacaoOng,
      table: {
        columns: PAGE_CONTENT.gerenciaDoacaoOng.table.columns,
        rows: [...registros, ...PAGE_CONTENT.gerenciaDoacaoOng.table.rows],
      },
    };
  });
}
