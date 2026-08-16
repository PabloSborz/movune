import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore, UserRegistrationInput } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-usuario.html',
  styleUrls: ['../access-form.css', './cadastro-usuario.css'],
})
export class CadastroUsuario {
  readonly interesses = [
    'Doacoes',
    'Voluntariado',
    'Eventos',
    'Educacao',
    'Meio ambiente',
    'Assistencia social',
  ];

  readonly form: UserRegistrationInput & { confirmarSenha: string; aceite: boolean } = {
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidadeEstado: '',
    interesses: 'Voluntariado',
    habilidades: '',
    senha: '',
    confirmarSenha: '',
    aceite: false,
  };

  feedback: 'error' | 'success' | null = null;
  message = '';

  constructor(
    private readonly auth: AuthStore,
    private readonly router: Router,
    route: ActivatedRoute,
  ) {
    const email = route.snapshot.queryParamMap.get('email');

    if (email) {
      this.form.email = email;
    }
  }

  cadastrar(): void {
    if (this.form.senha !== this.form.confirmarSenha) {
      this.feedback = 'error';
      this.message = 'As senhas precisam ser iguais.';
      return;
    }

    if (!this.form.aceite) {
      this.feedback = 'error';
      this.message = 'Confirme o aceite dos termos para continuar.';
      return;
    }

    const result = this.auth.registerUser({
      nomeCompleto: this.form.nomeCompleto,
      email: this.form.email,
      telefone: this.form.telefone,
      cidadeEstado: this.form.cidadeEstado,
      interesses: this.form.interesses,
      habilidades: this.form.habilidades,
      senha: this.form.senha,
    });

    if (!result.ok) {
      this.feedback = 'error';
      this.message = result.message;
      return;
    }

    this.feedback = 'success';
    this.message = result.message;
    void this.router.navigateByUrl(result.route || '/usuario/meu-perfil');
  }
}
