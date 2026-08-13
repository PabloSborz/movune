import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-detalhe-vaga-voluntario',
  imports: [FeaturePage],
  templateUrl: './detalhe-vaga-voluntario.html',
  styleUrl: './detalhe-vaga-voluntario.css',
})
export class DetalheVagaVoluntario {
  readonly page = PAGE_CONTENT.detalheVagaVoluntario;
}
