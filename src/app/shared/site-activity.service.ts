import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { AccessProfile, AuthSession } from './auth-store.service';

export type ActivityType =
  | 'contato'
  | 'doacao'
  | 'favorito'
  | 'formulario'
  | 'inscricao'
  | 'perfil'
  | 'prestacao'
  | 'projeto'
  | 'seguranca';

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  pageTitle: string;
  pageEyebrow: string;
  fields: Record<string, string>;
  status: string;
  createdAt: string;
  ownerId?: string;
  ownerName?: string;
  ownerProfile?: AccessProfile;
}

export interface ActivityInput {
  type?: ActivityType;
  pageTitle: string;
  pageEyebrow: string;
  fields: Record<string, string>;
  status?: string;
  session?: AuthSession | null;
}

const ACTIVITY_KEY = 'movune:atividades';

@Injectable({ providedIn: 'root' })
export class SiteActivityStore {
  readonly records = signal<ActivityRecord[]>([]);

  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.records.set(this.readRecords());
    }
  }

  save(input: ActivityInput): ActivityRecord {
    const record: ActivityRecord = {
      id: this.createId('activity'),
      type: input.type || this.inferType(input.pageTitle, input.pageEyebrow),
      pageTitle: input.pageTitle,
      pageEyebrow: input.pageEyebrow,
      fields: this.cleanFields(input.fields),
      status: input.status || 'Registrado',
      createdAt: new Date().toISOString(),
      ownerId: input.session?.id,
      ownerName: input.session?.nome,
      ownerProfile: input.session?.perfil,
    };

    this.records.set([record, ...this.records()]);
    this.persist();

    return record;
  }

  remove(id: string): void {
    this.records.set(this.records().filter((record) => record.id !== id));
    this.persist();
  }

  byType(type: ActivityType): ActivityRecord[] {
    return this.records().filter((record) => record.type === type);
  }

  byPage(pageTitle: string): ActivityRecord[] {
    return this.records().filter((record) => record.pageTitle === pageTitle);
  }

  private inferType(pageTitle: string, pageEyebrow: string): ActivityType {
    const text = `${pageTitle} ${pageEyebrow}`
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();

    if (text.includes('doac')) {
      return 'doacao';
    }

    if (text.includes('contato') || text.includes('atendimento')) {
      return 'contato';
    }

    if (text.includes('senha') || text.includes('seguranca')) {
      return 'seguranca';
    }

    if (text.includes('prestacao')) {
      return 'prestacao';
    }

    if (text.includes('perfil') || text.includes('configurac')) {
      return 'perfil';
    }

    if (text.includes('projeto')) {
      return 'projeto';
    }

    return 'formulario';
  }

  private cleanFields(fields: Record<string, string>): Record<string, string> {
    return Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value.trim()]),
    ) as Record<string, string>;
  }

  private readRecords(): ActivityRecord[] {
    const rawValue = globalThis.localStorage?.getItem(ACTIVITY_KEY);

    if (!rawValue) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawValue) as ActivityRecord[];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    if (!this.isBrowser || !globalThis.localStorage) {
      return;
    }

    globalThis.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(this.records()));
  }

  private createId(prefix: string): string {
    const randomValue =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${prefix}-${randomValue}`;
  }
}
