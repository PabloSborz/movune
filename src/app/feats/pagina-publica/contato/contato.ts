import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-contato',
  imports: [FeaturePage],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {
  readonly page = PAGE_CONTENT.contato;
}
