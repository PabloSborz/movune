import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-lista-ongs',
  imports: [FeaturePage],
  templateUrl: './lista-ongs.html',
  styleUrl: './lista-ongs.css',
})
export class ListaOngs {
  readonly page = PAGE_CONTENT.listaOngs;
}
