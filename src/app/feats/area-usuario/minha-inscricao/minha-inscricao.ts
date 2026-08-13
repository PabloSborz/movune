import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-minha-inscricao',
  imports: [FeaturePage],
  templateUrl: './minha-inscricao.html',
  styleUrl: './minha-inscricao.css',
})
export class MinhaInscricao {
  readonly page = PAGE_CONTENT.minhaInscricao;
}
