import { Component, inject } from '@angular/core';

import { NavigationHistoryService } from '../../shared/navigation-history.service';

@Component({
  selector: 'app-back-button',
  template: `
    <button class="header-back" type="button" (click)="navigationHistory.back()" aria-label="Voltar à página anterior">
      <span>Voltar</span>
    </button>
  `,
  styleUrl: './back-button.css',
  styles: ':host { display: block; margin-bottom: 24px; }',
})
export class BackButton {
  protected readonly navigationHistory = inject(NavigationHistoryService);
}
