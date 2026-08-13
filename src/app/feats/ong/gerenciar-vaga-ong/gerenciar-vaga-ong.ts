import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-vaga-ong',
  imports: [FeaturePage],
  templateUrl: './gerenciar-vaga-ong.html',
  styleUrl: './gerenciar-vaga-ong.css',
})
export class GerenciarVagaOng {
  readonly page = PAGE_CONTENT.gerenciarVagaOng;
}
