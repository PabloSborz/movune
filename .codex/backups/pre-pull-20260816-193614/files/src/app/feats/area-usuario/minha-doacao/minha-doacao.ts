import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { AuthStore } from '../../../shared/auth-store.service';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-minha-doacao',
  imports: [FeaturePage],
  templateUrl: './minha-doacao.html',
  styleUrl: './minha-doacao.css',
})
export class MinhaDoacao {
  private readonly activity = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);

  readonly page = computed(() => {
    const session = this.auth.session();
    const registros = this.activity
      .byType('doacao')
      .filter((record) => !session || record.ownerId === session.id)
      .map((record) => [
        record.fields['Projeto apoiado'] || record.pageTitle,
        record.fields['Valor ou item'] || record.fields['Tipo de doacao'] || 'Registrado',
        this.formatDate(record.createdAt),
        record.status,
      ]);

    const totalRegistrado = this.activity
      .byType('doacao')
      .filter((record) => !session || record.ownerId === session.id)
      .reduce((total, record) => total + this.parseCurrency(record.fields['Valor ou item']), 0);

    return {
      ...PAGE_CONTENT.minhaDoacao,
      metrics:
        registros.length > 0
          ? [
              { value: this.formatCurrency(totalRegistrado), label: 'total registrado' },
              { value: String(registros.length), label: 'doacoes registradas' },
              {
                value: String(new Set(registros.map((row) => row[0])).size),
                label: 'projetos apoiados',
              },
            ]
          : PAGE_CONTENT.minhaDoacao.metrics,
      table: {
        columns: PAGE_CONTENT.minhaDoacao.table.columns,
        rows: [...registros, ...PAGE_CONTENT.minhaDoacao.table.rows],
      },
    };
  });

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      style: 'currency',
    }).format(value);
  }

  private parseCurrency(value = ''): number {
    const normalized = value
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : 0;
  }
}
