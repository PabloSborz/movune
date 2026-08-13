import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-denuncia',
  imports: [FeaturePage],
  templateUrl: './gerenciar-denuncia.html',
  styleUrl: './gerenciar-denuncia.css',
})
export class GerenciarDenuncia {
  readonly page = PAGE_CONTENT.gerenciarDenuncia;
}
