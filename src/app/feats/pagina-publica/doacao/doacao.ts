import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-doacao',
  imports: [FeaturePage],
  templateUrl: './doacao.html',
  styleUrl: './doacao.css',
})
export class Doacao {
  readonly page = PAGE_CONTENT.doacoes;
}
