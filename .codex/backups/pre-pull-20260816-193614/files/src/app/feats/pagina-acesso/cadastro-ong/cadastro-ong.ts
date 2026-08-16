import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore, OngRegistrationInput } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-cadastro-ong',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-ong.html',
  styleUrls: ['../access-form.css', './cadastro-ong.css'],
})
export class CadastroOng {
  readonly areasAtuacao = [
    'Assistencia social',
    'Educacao',
    'Saude',
    'Meio ambiente',
    'Cultura',
    'Protecao animal',
  ];

  readonly form: OngRegistrationInput & { confirmarSenha: string; aceite: boolean } = {
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    responsavel: '',
    email: '',
    telefone: '',
    endereco: '',
    areaAtuacao: 'Assistencia social',
    documentos: '',
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
      this.message = 'Confirme o aceite das regras para cadastrar a ONG.';
      return;
    }

    const result = this.auth.registerOng({
      razaoSocial: this.form.razaoSocial,
      nomeFantasia: this.form.nomeFantasia,
      cnpj: this.form.cnpj,
      responsavel: this.form.responsavel,
      email: this.form.email,
      telefone: this.form.telefone,
      endereco: this.form.endereco,
      areaAtuacao: this.form.areaAtuacao,
      documentos: this.form.documentos,
      senha: this.form.senha,
    });

    if (!result.ok) {
      this.feedback = 'error';
      this.message = result.message;
      return;
    }

    this.feedback = 'success';
    this.message = result.message;
    void this.router.navigateByUrl(result.route || '/ong/painel');
  }
}
