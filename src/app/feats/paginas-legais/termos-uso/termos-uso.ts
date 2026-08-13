import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-termos-uso',
  imports: [FeaturePage],
  templateUrl: './termos-uso.html',
  styleUrl: './termos-uso.css',
})
export class TermosUso {
  readonly page = PAGE_CONTENT.termosUso;
}
