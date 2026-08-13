import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-configuracao-ong',
  imports: [FeaturePage],
  templateUrl: './configuracao-ong.html',
  styleUrl: './configuracao-ong.css',
})
export class ConfiguracaoOng {
  readonly page = PAGE_CONTENT.configuracaoOng;
}
