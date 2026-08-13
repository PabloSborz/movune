import { Component } from '@angular/core';

import { FeaturePage } from '../../../components/feature-page/feature-page';
import { PAGE_CONTENT } from '../../../shared/page-content';

@Component({
  selector: 'app-login',
  imports: [FeaturePage],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly page = PAGE_CONTENT.login;
}
