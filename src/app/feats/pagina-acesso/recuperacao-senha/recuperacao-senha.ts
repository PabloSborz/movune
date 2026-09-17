import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthStore } from '../../../shared/auth-store.service';
import { PasswordRecoveryService } from '../../../shared/password-recovery.service';

@Component({
  selector: 'app-recuperacao-senha',
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperacao-senha.html',
  styleUrl: './recuperacao-senha.css',
})
export class RecuperacaoSenha {
  email = '';
  error = '';
  resetLink = '';
  sentCode = '';
  state: 'form' | 'leaving' | 'success' = 'form';

  constructor(
    private readonly auth: AuthStore,
    private readonly recovery: PasswordRecoveryService,
    route: ActivatedRoute,
  ) {
    this.email = route.snapshot.queryParamMap.get('email') || '';
  }

  enviarLink(): void {
    const normalizedEmail = this.email.trim().toLowerCase();
    if (!normalizedEmail) {
      this.error = 'Informe seu e-mail cadastrado.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      this.error = 'Informe um e-mail válido.';
      return;
    }

    const exists =
      this.auth.users().some((user) => user.email === normalizedEmail) ||
      this.auth.ongs().some((ong) => ong.email === normalizedEmail);

    if (!exists) {
      this.error = 'Nenhuma conta foi encontrada com este e-mail.';
      return;
    }

    const request = this.recovery.create(normalizedEmail);
    this.sentCode = request.code;
    this.resetLink = `/redefinicao-senha?token=${encodeURIComponent(request.token)}`;
    this.error = '';
    this.state = 'leaving';

    // Mantém o formulário na tela até a animação de saída terminar.
    setTimeout(() => (this.state = 'success'), 300);
  }
}
