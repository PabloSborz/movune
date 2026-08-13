import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-politica-doacao',
  imports: [FeaturePage],
  templateUrl: './politica-doacao.html',
  styleUrl: './politica-doacao.css',
})
export class PoliticaDoacao {
  readonly page = PAGE_CONTENT.politicaDoacao;
}
