import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PageContent } from '../../shared/page-content';

@Component({
  selector: 'app-feature-page',
  imports: [CommonModule],
  templateUrl: './feature-page.html',
  styleUrl: './feature-page.css',
})
export class FeaturePage {
  @Input({ required: true }) page!: PageContent;
}
