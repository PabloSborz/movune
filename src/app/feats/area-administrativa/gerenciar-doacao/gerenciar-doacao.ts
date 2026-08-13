import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-doacao',
  imports: [FeaturePage],
  templateUrl: './gerenciar-doacao.html',
  styleUrl: './gerenciar-doacao.css',
})
export class GerenciarDoacao {
  readonly page = PAGE_CONTENT.gerenciarDoacao;
}
