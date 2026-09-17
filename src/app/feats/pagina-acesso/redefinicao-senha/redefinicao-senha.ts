import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../shared/auth-store.service';
import { PasswordRecoveryService } from '../../../shared/password-recovery.service';

@Component({
  selector: 'app-redefinicao-senha',
  imports: [FormsModule, RouterLink],
  templateUrl: './redefinicao-senha.html',
  styleUrl: './redefinicao-senha.css',
})
export class RedefinicaoSenha {
  readonly form = {
    codigo: '',
    confirmacao: '',
    email: '',
    senha: '',
    token: '',
  };

  feedback: 'error' | 'success' | null = null;
  codigoBloqueado = true;
  showPassword = false;
  showConfirmation = false;
  confirmationTouched = false;
  submitted = false;
  message = '';

  get passwordStrength(): number {
    const password = this.form.senha;
    if (!password) return 0;
    const score = [
      password.length >= 8,
      /[a-z]/.test(password) && /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
    // Uma senha curta nunca recebe classificação suficiente para envio.
    return password.length < 8 ? Math.min(score, 2) : score;
  }

  get strengthLabel(): string {
    return ['', 'Fraca', 'Razoável', 'Forte e aceita', 'Muito forte'][this.passwordStrength];
  }

  get confirmationMismatch(): boolean {
    return (
      (this.confirmationTouched || this.submitted) &&
      !!this.form.confirmacao &&
      this.form.confirmacao !== this.form.senha
    );
  }

  constructor(
    private readonly auth: AuthStore,
    private readonly recovery: PasswordRecoveryService,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    this.form.token = route.snapshot.queryParamMap.get('token') || '';
    this.form.email = this.recovery.getEmail(this.form.token) || '';
  }

  redefinirSenha(): void {
    this.submitted = true;
    if (!this.form.email) {
      this.setError('Link inválido ou expirado. Solicite uma nova recuperação.');
      return;
    }
    if (!this.form.codigo.trim()) {
      this.setError('Informe o código de verificação.');
      return;
    }
    if (this.form.senha.length < 8 || this.passwordStrength < 3) {
      this.setError('Crie uma senha de pelo menos 8 caracteres com força Forte ou Muito forte.');
      return;
    }
    if (!this.form.confirmacao || this.form.senha !== this.form.confirmacao) {
      this.setError('As senhas não coincidem.');
      return;
    }

    const request = this.recovery.validate(this.form.token.trim(), this.form.codigo.trim());

    if (!request) {
      this.setError('Código ou link inválido ou expirado. Solicite uma nova recuperação.');
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
    setTimeout(
      () => void this.router.navigate(['/login'], { queryParams: { email: request.email } }),
      900,
    );
  }

  habilitarCodigo(event: Event): void {
    if (!this.codigoBloqueado) {
      return;
    }

    this.codigoBloqueado = false;
    this.form.codigo = '';

    const input = event.target as HTMLInputElement;
    input.value = '';
    input.removeAttribute('readonly');
  }

  private setError(message: string): void {
    this.feedback = 'error';
    this.message = message;
  }
}
