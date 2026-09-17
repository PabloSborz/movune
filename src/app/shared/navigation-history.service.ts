import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly visited: string[] = [];
  private navigationTrigger: 'imperative' | 'popstate' | 'hashchange' = 'imperative';

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigationTrigger = event.navigationTrigger ?? 'imperative';
      }

      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (this.navigationTrigger === 'popstate') {
          const previousIndex = this.visited.lastIndexOf(url);
          if (previousIndex >= 0) {
            this.visited.splice(previousIndex + 1);
            return;
          }
        }

        if (this.visited.at(-1) !== url) {
          this.visited.push(url);
        }
      }
    });
  }

  back(): void {
    if (this.visited.length > 1) {
      this.location.back();
      return;
    }

    void this.router.navigateByUrl('/');
  }
}
