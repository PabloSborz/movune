import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-detalhes-projeto',
  imports: [FeaturePage],
  templateUrl: './detalhes-projeto.html',
  styleUrl: './detalhes-projeto.css',
})
export class DetalhesProjeto {
  readonly page = PAGE_CONTENT.detalhesProjeto;
}
