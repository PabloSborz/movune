import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-como-funciona',
  imports: [FeaturePage],
  templateUrl: './como-funciona.html',
  styleUrl: './como-funciona.css',
})
export class ComoFunciona {
  readonly page = PAGE_CONTENT.comoFunciona;
}
