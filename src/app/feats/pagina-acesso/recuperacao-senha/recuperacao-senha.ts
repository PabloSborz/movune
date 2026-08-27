import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthStore } from '../../../shared/auth-store.service';
import { PasswordRecoveryService } from '../../../shared/password-recovery.service';

@Component({
  selector: 'app-recuperacao-senha',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperacao-senha.html',
  styleUrls: ['../access-form.css', './recuperacao-senha.css'],
})
export class RecuperacaoSenha {
  email = '';
  message = '';
  resetLink = '';
  sentCode = '';

  constructor(
    private readonly auth: AuthStore,
    private readonly recovery: PasswordRecoveryService,
    route: ActivatedRoute,
  ) {
    this.email = route.snapshot.queryParamMap.get('email') || '';
  }

  enviarCodigo(): void {
    const normalizedEmail = this.email.trim().toLowerCase();
    const exists =
      this.auth.users().some((user) => user.email === normalizedEmail) ||
      this.auth.ongs().some((ong) => ong.email === normalizedEmail);

    if (!exists) {
      this.message = 'Nenhuma conta foi encontrada com este e-mail.';
      this.resetLink = '';
      return;
    }

    const request = this.recovery.create(normalizedEmail);
    this.sentCode = request.code;
    this.resetLink = `/redefinicao-senha?token=${encodeURIComponent(request.token)}&codigo=${request.code}`;
    this.message = 'Codigo enviado. Verifique o e-mail cadastrado.';
  }
}
