import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-projetos',
  imports: [FeaturePage],
  templateUrl: './gerenciar-projetos.html',
  styleUrl: './gerenciar-projetos.css',
})
export class GerenciarProjetos {
  readonly page = PAGE_CONTENT.gerenciarProjetos;
}
