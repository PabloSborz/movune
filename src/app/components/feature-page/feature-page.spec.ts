import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { AuthStore } from '../../shared/auth-store.service';
import { SiteActivityStore } from '../../shared/site-activity.service';
import { FeaturePage } from './feature-page';

describe('FeaturePage', () => {
  it('does not create a duplicate enrollment for the same activity', () => {
    const save = vi.fn();
    const session = signal({ id: 'usuario-1', perfil: 'usuario' as const, nome: 'Ana' });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: { session } },
        {
          provide: SiteActivityStore,
          useValue: {
            byType: () => [{ ownerId: 'usuario-1', pageTitle: 'Mentoria de carreira' }],
            save,
          },
        },
        { provide: Router, useValue: { url: '/', navigate: vi.fn(), navigateByUrl: vi.fn() } },
      ],
    });

    const page = TestBed.runInInjectionContext(() => new FeaturePage());
    page.page = { eyebrow: 'Voluntariado', title: 'Mentoria de carreira', description: '' };
    page.executarAcao({ label: 'Inscrever-se', href: '#' });

    expect(save).not.toHaveBeenCalled();
    expect(page.message).toBe('Você já se inscreveu nesta atividade.');
  });
});
