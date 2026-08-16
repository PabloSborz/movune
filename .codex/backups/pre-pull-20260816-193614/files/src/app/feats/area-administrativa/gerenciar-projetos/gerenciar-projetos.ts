import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-gerenciar-projetos',
  imports: [FeaturePage],
  templateUrl: './gerenciar-projetos.html',
  styleUrl: './gerenciar-projetos.css',
})
export class GerenciarProjetos {
  private readonly activity = inject(SiteActivityStore);

  readonly page = computed(() => {
    const registros = this.activity
      .byType('projeto')
      .map((record) => [
        record.fields['Nome do projeto'] || record.pageTitle,
        record.ownerName || 'ONG nao informada',
        record.fields['Categoria'] || 'Sem categoria',
        record.status,
      ]);

    return {
      ...PAGE_CONTENT.gerenciarProjetos,
      table: {
        columns: PAGE_CONTENT.gerenciarProjetos.table.columns,
        rows: [...registros, ...PAGE_CONTENT.gerenciarProjetos.table.rows],
      },
    };
  });
}
