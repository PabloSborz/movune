import { Component, ElementRef, DestroyRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OngShell } from '../../../components/ong-shell/ong-shell';
import { AuthStore } from '../../../shared/auth-store.service';
import { initializeOngPage } from '../shared/ong-pages';
@Component({
  selector: 'app-relatorio-ong', imports: [OngShell],
  templateUrl: './relatorio-ong.html', styleUrls: ['../shared/ong-pages.css', '../shared/ong-widgets.css', '../shared/ong-responsive.css', './relatorio-ong.css'],
  encapsulation: ViewEncapsulation.None, host: { class: 'ong-workspace' },
})
export class RelatorioOng {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  constructor() {
    afterNextRender(() => {
      const cleanup = initializeOngPage(this.host.nativeElement, 'relatorios', {
        owner: this.auth.session()?.id ?? 'demo', email: this.auth.session()?.email ?? 'contato@redecuidar.org',
        path: this.router.url, navigate: path => { void this.router.navigateByUrl(path); },
        changePassword: (current, next) => {
          const account = this.auth.ongs().find(ong => ong.id === this.auth.session()?.id);
          if (!account || account.senha !== current) return 'Senha atual incorreta.';
          const result = this.auth.updatePassword(account.email, next);
          return result.ok ? '' : result.message;
        },
        deactivate: () => { const id = this.auth.session()?.id; if (id) this.auth.removeOng(id); this.auth.logout(); void this.router.navigateByUrl('/login'); },
      });
      this.destroy.onDestroy(cleanup);
    });
  }
}
