import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-transparencia',
  imports: [FeaturePage],
  templateUrl: './transparencia.html',
  styleUrl: './transparencia.css',
})
export class Transparencia {
  readonly page = PAGE_CONTENT.transparencia;
}
