import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-documento-ong',
  imports: [FeaturePage],
  templateUrl: './documento-ong.html',
  styleUrl: './documento-ong.css',
})
export class DocumentoOng {
  readonly page = PAGE_CONTENT.documentoOng;
}
