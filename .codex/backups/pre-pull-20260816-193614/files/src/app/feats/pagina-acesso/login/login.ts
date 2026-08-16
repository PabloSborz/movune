import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AccessProfile, AuthStore } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['../access-form.css', './login.css'],
})
export class Login {
  readonly perfis: Array<{ label: string; value: AccessProfile }> = [
    { label: 'Usuario', value: 'usuario' },
    { label: 'ONG', value: 'ong' },
    { label: 'Administrador', value: 'admin' },
  ];

  readonly form = {
    perfil: 'usuario' as AccessProfile,
    identificador: '',
    senha: '',
  };

  feedback: 'error' | 'success' | null = null;
  message = '';

  private readonly returnUrl: string | null;

  constructor(
    private readonly auth: AuthStore,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    const requestedProfile = route.snapshot.queryParamMap.get('perfil');
    this.returnUrl = route.snapshot.queryParamMap.get('retorno');

    if (this.isAccessProfile(requestedProfile)) {
      this.form.perfil = requestedProfile;
    }

    const email = route.snapshot.queryParamMap.get('email');

    if (email) {
      this.form.identificador = email;
    }
  }

  entrar(): void {
    const result = this.auth.login({
      perfil: this.form.perfil,
      identificador: this.form.identificador,
      senha: this.form.senha,
    });

    if (!result.ok) {
      this.feedback = 'error';
      this.message = result.message;
      return;
    }

    this.feedback = 'success';
    this.message = result.message;

    void this.router.navigateByUrl(this.getDestination(result.route));
  }

  private isAccessProfile(value: string | null): value is AccessProfile {
    return value === 'usuario' || value === 'ong' || value === 'admin';
  }

  private getDestination(defaultRoute?: string): string {
    if (this.returnUrl?.startsWith('/') && !this.returnUrl.startsWith('//')) {
      return this.returnUrl;
    }

    return defaultRoute || '/';
  }
}
