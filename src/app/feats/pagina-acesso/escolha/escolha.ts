import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-escolha',
  imports: [Footer, RouterLink],
  templateUrl: './escolha.html',
  styleUrl: './escolha.css',
})
export class Escolha {
  private readonly route = inject(ActivatedRoute);
  readonly queryParams = this.route.snapshot.queryParamMap.get('email')
    ? { email: this.route.snapshot.queryParamMap.get('email') }
    : {};
}
