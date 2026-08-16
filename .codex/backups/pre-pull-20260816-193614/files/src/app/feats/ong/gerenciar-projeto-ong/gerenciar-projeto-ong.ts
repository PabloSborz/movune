import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-gerenciar-projeto-ong',
  imports: [FeaturePage],
  templateUrl: './gerenciar-projeto-ong.html',
  styleUrl: './gerenciar-projeto-ong.css',
})
export class GerenciarProjetoOng {
  private readonly activity = inject(SiteActivityStore);

  readonly page = computed(() => {
    const registros = this.activity
      .byType('projeto')
      .map((record) => [
        record.fields['Nome do projeto'] || record.pageTitle,
        record.fields['Meta financeira'] || 'A definir',
        record.fields['Prazo'] || this.formatDate(record.createdAt),
        record.status,
      ]);

    return {
      ...PAGE_CONTENT.gerenciarProjetoOng,
      table: {
        columns: PAGE_CONTENT.gerenciarProjetoOng.table.columns,
        rows: [...registros, ...PAGE_CONTENT.gerenciarProjetoOng.table.rows],
      },
    };
  });

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  }
}
