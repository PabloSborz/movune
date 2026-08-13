import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-relatorio-ong',
  imports: [FeaturePage],
  templateUrl: './relatorio-ong.html',
  styleUrl: './relatorio-ong.css',
})
export class RelatorioOng {
  readonly page = PAGE_CONTENT.relatorioOng;
}
