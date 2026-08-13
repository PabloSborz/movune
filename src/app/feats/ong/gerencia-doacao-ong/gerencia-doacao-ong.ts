import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerencia-doacao-ong',
  imports: [FeaturePage],
  templateUrl: './gerencia-doacao-ong.html',
  styleUrl: './gerencia-doacao-ong.css',
})
export class GerenciaDoacaoOng {
  readonly page = PAGE_CONTENT.gerenciaDoacaoOng;
}
