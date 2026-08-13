import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-voluntario-ong',
  imports: [FeaturePage],
  templateUrl: './gerenciar-voluntario-ong.html',
  styleUrl: './gerenciar-voluntario-ong.css',
})
export class GerenciarVoluntarioOng {
  readonly page = PAGE_CONTENT.gerenciarVoluntarioOng;
}
