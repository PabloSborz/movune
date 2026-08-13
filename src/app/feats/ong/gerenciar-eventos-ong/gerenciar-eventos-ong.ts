import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-eventos-ong',
  imports: [FeaturePage],
  templateUrl: './gerenciar-eventos-ong.html',
  styleUrl: './gerenciar-eventos-ong.css',
})
export class GerenciarEventosOng {
  readonly page = PAGE_CONTENT.gerenciarEventosOng;
}
