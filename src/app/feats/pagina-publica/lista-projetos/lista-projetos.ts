import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-lista-projetos',
  imports: [FeaturePage],
  templateUrl: './lista-projetos.html',
  styleUrl: './lista-projetos.css',
})
export class ListaProjetos {
  readonly page = PAGE_CONTENT.listaProjetos;
}
