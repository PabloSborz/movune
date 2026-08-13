import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-certificado',
  imports: [FeaturePage],
  templateUrl: './certificado.html',
  styleUrl: './certificado.css',
})
export class Certificado {
  readonly page = PAGE_CONTENT.certificado;
}
