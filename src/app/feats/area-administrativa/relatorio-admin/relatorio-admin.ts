import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-relatorio-admin',
  imports: [FeaturePage],
  templateUrl: './relatorio-admin.html',
  styleUrl: './relatorio-admin.css',
})
export class RelatorioAdmin {
  readonly page = PAGE_CONTENT.relatorioAdmin;
}
