import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [Footer, Header, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  protected readonly isHome = signal(true);
  protected readonly isLogin = signal(false);
  protected readonly isAccessPage = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHome.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/');
        this.isLogin.set(event.urlAfterRedirects.split(/[?#]/)[0] === '/login');
        this.isAccessPage.set(['/cadastro-usuario', '/cadastro-ong', '/escolha'].includes(event.urlAfterRedirects.split(/[?#]/)[0]));
      }
    });
  }
}
