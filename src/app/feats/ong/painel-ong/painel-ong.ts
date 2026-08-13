import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-painel-ong',
  imports: [FeaturePage],
  templateUrl: './painel-ong.html',
  styleUrl: './painel-ong.css',
})
export class PainelOng {
  readonly page = PAGE_CONTENT.painelOng;
}
