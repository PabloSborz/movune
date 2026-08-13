import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-detalhes-eventos',
  imports: [FeaturePage],
  templateUrl: './detalhes-eventos.html',
  styleUrl: './detalhes-eventos.css',
})
export class DetalhesEventos {
  readonly page = PAGE_CONTENT.detalhesEventos;
}
