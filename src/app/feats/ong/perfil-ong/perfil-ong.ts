import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { initializePublicProfile } from '../standalone/perfil-ong/profile.js';

@Component({
  selector: 'app-perfil-ong',
  templateUrl: './perfil-ong.html',
  styleUrl: './perfil-ong.css',
})
export class PerfilOng {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);

  constructor() {
    // Angular only mounts the page; all interactions live in the vanilla JS module.
    afterNextRender(() => {
      const cleanup = initializePublicProfile(this.host.nativeElement);
      this.destroy.onDestroy(cleanup);
    });
  }
}
