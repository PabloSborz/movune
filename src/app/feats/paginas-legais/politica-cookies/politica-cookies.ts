import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-politica-cookies',
  imports: [FeaturePage],
  templateUrl: './politica-cookies.html',
  styleUrl: './politica-cookies.css',
})
export class PoliticaCookies {
  readonly page = PAGE_CONTENT.politicaCookies;
}
