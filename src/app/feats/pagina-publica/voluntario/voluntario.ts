import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-voluntario',
  imports: [FeaturePage],
  templateUrl: './voluntario.html',
  styleUrl: './voluntario.css',
})
export class Voluntario {
  readonly page = PAGE_CONTENT.voluntariado;
}
