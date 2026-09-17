import { Component, inject } from '@angular/core';

import { UserAreaShell } from '../../../components/user-area-shell/user-area-shell';
import { AuthStore } from '../../../shared/auth-store.service';
import { SiteActivityStore } from '../../../shared/site-activity.service';

interface DonationRow {
  id: string;
  project: string;
  amount: string;
  date: string;
  dateIso: string;
}

const SAMPLE_DONATIONS: DonationRow[] = [
  {
    id: 'demo-biblioteca',
    project: 'Biblioteca de bairro',
    amount: 'R$ 500',
    date: '10/Set/2026',
    dateIso: '2026-09-10',
  },
  {
    id: 'demo-cozinha',
    project: 'Cozinha solidária',
    amount: 'R$ 250',
    date: '15/Ago/2026',
    dateIso: '2026-08-15',
  },
  {
    id: 'demo-horta',
    project: 'Horta escola',
    amount: 'R$ 300',
    date: '20/Jul/2026',
    dateIso: '2026-07-20',
  },
  {
    id: 'demo-saude',
    project: 'Saúde na comunidade',
    amount: 'R$ 200',
    date: '05/Jun/2026',
    dateIso: '2026-06-05',
  },
];

@Component({
  selector: 'app-minha-doacao',
  imports: [UserAreaShell],
  templateUrl: './minha-doacao.html',
  styleUrl: './minha-doacao.css',
})
export class MinhaDoacao {
  private readonly activity = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);
  sortBy: 'amount' | 'date' | null = null;
  ascending = true;
  toast = '';

  get isExampleData(): boolean {
    return this.realRows.length === 0;
  }

  get rows(): DonationRow[] {
    const rows = this.realRows.length ? this.realRows : SAMPLE_DONATIONS;
    if (!this.sortBy) return rows;
    const direction = this.ascending ? 1 : -1;
    return [...rows].sort((first, second) => {
      const a =
        this.sortBy === 'amount'
          ? this.parseCurrency(first.amount)
          : new Date(first.dateIso).getTime();
      const b =
        this.sortBy === 'amount'
          ? this.parseCurrency(second.amount)
          : new Date(second.dateIso).getTime();
      return (a - b) * direction;
    });
  }

  get totalDonated(): string {
    if (this.isExampleData) return 'R$ 1.250';
    const total = this.realRows.reduce((sum, row) => sum + this.parseCurrency(row.amount), 0);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(total);
  }

  get supportedProjects(): number {
    return this.isExampleData ? 4 : new Set(this.realRows.map((row) => row.project)).size;
  }

  get latestDonation(): { month: string; project: string } {
    if (this.isExampleData) return { month: 'Set/2026', project: 'Biblioteca de bairro' };
    const latest = [...this.realRows].sort(
      (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime(),
    )[0];
    const date = new Date(latest.dateIso);
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return { month: `${months[date.getMonth()]}/${date.getFullYear()}`, project: latest.project };
  }

  sort(column: 'amount' | 'date'): void {
    this.ascending = this.sortBy === column ? !this.ascending : true;
    this.sortBy = column;
  }

  downloadReceipt(row: DonationRow): void {
    const text = [
      'MOVUNE — RESUMO DE DOAÇÃO',
      this.isExampleData ? 'Documento de demonstração' : 'Registro da plataforma',
      `Projeto: ${row.project}`,
      `Valor ou item: ${row.amount}`,
      `Data: ${row.date}`,
      'Este arquivo não substitui um comprovante fiscal.',
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprovante-${row.id}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.toast = 'Download iniciado.';
    setTimeout(() => (this.toast = ''), 3000);
  }

  private get realRows(): DonationRow[] {
    const sessionId = this.auth.session()?.id;
    if (!sessionId) return [];
    return this.activity
      .records()
      .filter((record) => record.type === 'doacao' && record.ownerId === sessionId)
      .map((record) => ({
        id: record.id,
        project: record.fields['Projeto apoiado'] || record.pageTitle,
        amount:
          record.fields['Valor ou item'] || record.fields['Tipo de doacao'] || 'Não informado',
        date: this.formatDate(record.createdAt),
        dateIso: record.createdAt,
      }));
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return `${String(date.getDate()).padStart(2, '0')}/${months[date.getMonth()]}/${date.getFullYear()}`;
  }

  private parseCurrency(value = ''): number {
    const parsed = Number(
      value
        .replace(/[^\d,.-]/g, '')
        .replace(/\./g, '')
        .replace(',', '.'),
    );
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
