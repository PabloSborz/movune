import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChoiceDialogService {
  readonly isOpen = signal(false);
  readonly email = signal('');

  open(email = ''): void {
    this.email.set(email);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
