import { Component, computed, inject } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { AuthStore } from '../../../shared/auth-store.service';
import { PAGE_CONTENT } from '../../../shared/page-content';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-painel-admin',
  imports: [FeaturePage],
  templateUrl: './painel-admin.html',
  styleUrl: './painel-admin.css',
})
export class PainelAdmin {
  private readonly auth = inject(AuthStore);
  private readonly activity = inject(SiteActivityStore);

  readonly page = computed(() => ({
    ...PAGE_CONTENT.painelAdmin,
    metrics: [
      { value: String(this.auth.users().length), label: 'usuarios cadastrados' },
      { value: String(this.auth.ongs().length), label: 'ONGs cadastradas' },
      { value: String(this.activity.byType('projeto').length), label: 'projetos cadastrados' },
      { value: String(this.activity.records().length), label: 'registros ativos' },
    ],
  }));
}
