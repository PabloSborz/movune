import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-gerenciar-usuario',
  imports: [FeaturePage],
  templateUrl: './gerenciar-usuario.html',
  styleUrl: './gerenciar-usuario.css',
})
export class GerenciarUsuario {
  readonly page = PAGE_CONTENT.gerenciarUsuario;
}
