import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-empresas-parceiras',
  imports: [FeaturePage],
  templateUrl: './empresas-parceiras.html',
  styleUrl: './empresas-parceiras.css',
})
export class EmpresasParceiras {
  readonly page = PAGE_CONTENT.empresasParceiras;
}
