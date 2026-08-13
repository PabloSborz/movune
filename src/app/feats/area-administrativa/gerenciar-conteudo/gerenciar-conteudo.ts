import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-conteudo',
  imports: [FeaturePage],
  templateUrl: './gerenciar-conteudo.html',
  styleUrl: './gerenciar-conteudo.css',
})
export class GerenciarConteudo {
  readonly page = PAGE_CONTENT.gerenciarConteudo;
}
