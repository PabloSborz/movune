import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-sobre',
  imports: [FeaturePage],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css',
})
export class Sobre {
  readonly page = PAGE_CONTENT.sobre;
}
