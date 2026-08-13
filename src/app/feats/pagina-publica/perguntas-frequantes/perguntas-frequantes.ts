import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-perguntas-frequantes',
  imports: [FeaturePage],
  templateUrl: './perguntas-frequantes.html',
  styleUrl: './perguntas-frequantes.css',
})
export class PerguntasFrequantes {
  readonly page = PAGE_CONTENT.perguntasFrequentes;
}
