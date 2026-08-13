import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-editar-ong',
  imports: [FeaturePage],
  templateUrl: './editar-ong.html',
  styleUrl: './editar-ong.css',
})
export class EditarOng {
  readonly page = PAGE_CONTENT.editarOng;
}
