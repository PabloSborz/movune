import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-politica-privacidade',
  imports: [FeaturePage],
  templateUrl: './politica-privacidade.html',
  styleUrl: './politica-privacidade.css',
})
export class PoliticaPrivacidade {
  readonly page = PAGE_CONTENT.politicaPrivacidade;
}
