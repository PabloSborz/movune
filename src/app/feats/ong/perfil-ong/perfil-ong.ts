import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-perfil-ong',
  imports: [FeaturePage],
  templateUrl: './perfil-ong.html',
  styleUrl: './perfil-ong.css',
})
export class PerfilOng {
  readonly page = PAGE_CONTENT.perfilOng;
}
