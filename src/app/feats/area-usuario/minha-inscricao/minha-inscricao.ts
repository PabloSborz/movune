import { KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserAreaShell } from '../../../components/user-area-shell/user-area-shell';
import { AuthStore } from '../../../shared/auth-store.service';
import { ActivityRecord, SiteActivityStore } from '../../../shared/site-activity.service';

interface Enrollment {
  id: string;
  activity: string;
  type: string;
  date: string;
  status: string;
  record?: ActivityRecord;
}

const REMOVAL_ANIMATION_MS = 200;

@Component({
  selector: 'app-minha-inscricao',
  imports: [FormsModule, KeyValuePipe, UserAreaShell],
  templateUrl: './minha-inscricao.html',
  styleUrl: './minha-inscricao.css',
})
export class MinhaInscricao {
  private readonly activityStore = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);
  // Mantém a decisão inicial para não exibir exemplos após remover uma inscrição real.
  private readonly demoMode = !this.activityStore
    .records()
    .some((record) => record.type === 'inscricao' && record.ownerId === this.auth.session()?.id);
  private readonly examples = signal<Enrollment[]>([
    {
      id: 'demo-mentoria',
      activity: 'Mentoria de carreira',
      type: 'Voluntariado',
      date: '15/Set/2026',
      status: 'Confirmada',
    },
    {
      id: 'demo-mutirao',
      activity: 'Mutirão de arrecadação',
      type: 'Evento',
      date: '25/Out/2026',
      status: 'Pendente',
    },
    {
      id: 'demo-oficina',
      activity: 'Oficina de educação financeira',
      type: 'Evento',
      date: '02/Nov/2026',
      status: 'Confirmada',
    },
    {
      id: 'demo-aulas',
      activity: 'Aulas de reforço',
      type: 'Voluntariado',
      date: '10/Nov/2026',
      status: 'Em análise',
    },
  ]);

  typeFilter = '';
  statusFilter = '';
  details: Enrollment | null = null;
  cancelPending: Enrollment | null = null;
  removingId = '';

  get rows(): Enrollment[] {
    const sessionId = this.auth.session()?.id;
    const real = this.activityStore
      .records()
      .filter((record) => record.type === 'inscricao' && record.ownerId === sessionId)
      .map((record) => ({
        id: record.id,
        activity: record.fields['Atividade'] || record.pageTitle,
        type: record.fields['Tipo'] || 'Voluntariado',
        date: this.formatDate(record.createdAt),
        status: record.status,
        record,
      }));
    return real.length || !this.demoMode ? real : this.examples();
  }

  get filteredRows(): Enrollment[] {
    return this.rows.filter(
      (row) =>
        (!this.typeFilter || row.type === this.typeFilter) &&
        (!this.statusFilter || row.status === this.statusFilter),
    );
  }

  get isExampleData(): boolean {
    return (
      this.demoMode &&
      !this.activityStore
        .records()
        .some((record) => record.type === 'inscricao' && record.ownerId === this.auth.session()?.id)
    );
  }

  confirmCancel(): void {
    const pending = this.cancelPending;
    if (!pending) {
      return;
    }

    this.cancelPending = null;
    this.removingId = pending.id;

    // Aguarda a animação da linha antes de atualizar os dados.
    setTimeout(() => {
      if (pending.record) {
        this.activityStore.remove(pending.id);
      } else {
        this.examples.update((rows) =>
          rows.map((row) => (row.id === pending.id ? { ...row, status: 'Cancelada' } : row)),
        );
      }

      this.removingId = '';
    }, REMOVAL_ANIMATION_MS);
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
}
