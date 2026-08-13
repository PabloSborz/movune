import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-recuperacao-senha',
  imports: [FeaturePage],
  templateUrl: './recuperacao-senha.html',
  styleUrl: './recuperacao-senha.css',
})
export class RecuperacaoSenha {
  readonly page = PAGE_CONTENT.recuperacaoSenha;
}
