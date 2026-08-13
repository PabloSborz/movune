import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-cadastrar-projeto-ong',
  imports: [FeaturePage],
  templateUrl: './cadastrar-projeto-ong.html',
  styleUrl: './cadastrar-projeto-ong.css',
})
export class CadastrarProjetoOng {
  readonly page = PAGE_CONTENT.cadastrarProjetoOng;
}
