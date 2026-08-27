import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../shared/auth-store.service';
import { PasswordRecoveryService } from '../../../shared/password-recovery.service';

@Component({
  selector: 'app-redefinicao-senha',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './redefinicao-senha.html',
  styleUrls: ['../access-form.css', './redefinicao-senha.css'],
})
export class RedefinicaoSenha {
  readonly form = {
    codigo: '',
    confirmacao: '',
    senha: '',
    token: '',
  };

  feedback: 'error' | 'success' | null = null;
  message = '';

  constructor(
    private readonly auth: AuthStore,
    private readonly recovery: PasswordRecoveryService,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    this.form.token = route.snapshot.queryParamMap.get('token') || '';
    this.form.codigo = route.snapshot.queryParamMap.get('codigo') || '';
  }

  redefinirSenha(): void {
    if (this.form.senha.length < 6) {
      this.setError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (this.form.senha !== this.form.confirmacao) {
      this.setError('As senhas precisam ser iguais.');
      return;
    }

    const request = this.recovery.validate(this.form.token.trim(), this.form.codigo.trim());

    if (!request) {
      this.setError('Codigo ou link invalido ou expirado. Solicite uma nova recuperacao.');
      return;
    }

    const result = this.auth.updatePassword(request.email, this.form.senha);

    if (!result.ok) {
      this.setError(result.message);
      return;
    }

    this.recovery.clear();
    this.feedback = 'success';
    this.message = 'Senha atualizada. Redirecionando para o login...';
    setTimeout(() => void this.router.navigate(['/login'], { queryParams: { email: request.email } }), 900);
  }

  private setError(message: string): void {
    this.feedback = 'error';
    this.message = message;
  }
}
