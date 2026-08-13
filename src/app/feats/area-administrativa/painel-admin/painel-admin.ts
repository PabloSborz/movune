import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-painel-admin',
  imports: [FeaturePage],
  templateUrl: './painel-admin.html',
  styleUrl: './painel-admin.css',
})
export class PainelAdmin {
  readonly page = PAGE_CONTENT.painelAdmin;
}
