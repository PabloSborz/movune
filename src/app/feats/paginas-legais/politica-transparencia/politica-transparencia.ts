import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-politica-transparencia',
  imports: [FeaturePage],
  templateUrl: './politica-transparencia.html',
  styleUrl: './politica-transparencia.css',
})
export class PoliticaTransparencia {
  readonly page = PAGE_CONTENT.politicaTransparencia;
}
