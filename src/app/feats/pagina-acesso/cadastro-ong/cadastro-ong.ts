import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-cadastro-ong',
  imports: [FeaturePage],
  templateUrl: './cadastro-ong.html',
  styleUrl: './cadastro-ong.css',
})
export class CadastroOng {
  readonly page = PAGE_CONTENT.cadastroOng;
}
