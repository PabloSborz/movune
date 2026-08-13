import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-projeto-ong',
  imports: [FeaturePage],
  templateUrl: './gerenciar-projeto-ong.html',
  styleUrl: './gerenciar-projeto-ong.css',
})
export class GerenciarProjetoOng {
  readonly page = PAGE_CONTENT.gerenciarProjetoOng;
}
