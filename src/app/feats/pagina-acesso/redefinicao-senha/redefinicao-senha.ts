import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-redefinicao-senha',
  imports: [FeaturePage],
  templateUrl: './redefinicao-senha.html',
  styleUrl: './redefinicao-senha.css',
})
export class RedefinicaoSenha {
  readonly page = PAGE_CONTENT.redefinicaoSenha;
}
