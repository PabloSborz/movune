import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-ongs',
  imports: [FeaturePage],
  templateUrl: './gerenciar-ongs.html',
  styleUrl: './gerenciar-ongs.css',
})
export class GerenciarOngs {
  readonly page = PAGE_CONTENT.gerenciarOngs;
}
