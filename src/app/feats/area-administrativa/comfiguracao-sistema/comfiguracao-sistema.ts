import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-comfiguracao-sistema',
  imports: [FeaturePage],
  templateUrl: './comfiguracao-sistema.html',
  styleUrl: './comfiguracao-sistema.css',
})
export class ComfiguracaoSistema {
  readonly page = PAGE_CONTENT.configuracaoSistema;
}
