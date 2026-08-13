import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-prestacao-conta-ong',
  imports: [FeaturePage],
  templateUrl: './prestacao-conta-ong.html',
  styleUrl: './prestacao-conta-ong.css',
})
export class PrestacaoContaOng {
  readonly page = PAGE_CONTENT.prestacaoContaOng;
}
