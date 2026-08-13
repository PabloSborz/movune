import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-home',
  imports: [FeaturePage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly page = PAGE_CONTENT.home;
}
