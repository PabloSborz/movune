import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-minha-doacao',
  imports: [FeaturePage],
  templateUrl: './minha-doacao.html',
  styleUrl: './minha-doacao.css',
})
export class MinhaDoacao {
  readonly page = PAGE_CONTENT.minhaDoacao;
}
