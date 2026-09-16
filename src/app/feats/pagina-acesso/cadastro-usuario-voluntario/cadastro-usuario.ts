import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css',
})
export class CadastroUsuario {
  readonly causas = ['Educação', 'Saúde', 'Meio Ambiente', 'Assistência Social', 'Cultura'];
  readonly especialidades = ['Comunicação', 'Design', 'Tecnologia', 'Gestão', 'Ensino'];
  readonly selectedCausas = new Set(['Educação', 'Saúde', 'Assistência Social']);
  readonly selectedEspecialidades = new Set(['Design', 'Tecnologia']);

  readonly form = {
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    senha: '',
    confirmarSenha: '',
    aceite: false,
  };

  feedback: 'error' | 'success' | null = null;
  message = '';
  showPassword = false;
  showConfirmation = false;

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
    if (!this.form.nomeCompleto.trim() || !this.form.email.trim() || !this.form.cidade.trim() || !this.form.estado.trim() || !this.form.senha) {
      this.setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!/^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/.test(this.form.telefone)) {
      this.setError('Informe um telefone com DDD no formato (XX) XXXXX-XXXX.');
      return;
    }

    if (this.form.senha.length < 6) {
      this.setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (this.form.senha !== this.form.confirmarSenha) {
      this.setError('As senhas precisam ser iguais.');
      return;
    }

    if (!this.form.aceite) {
      this.setError('Confirme o aceite dos termos para continuar.');
      return;
    }

    const result = this.auth.registerUser({
      nomeCompleto: this.form.nomeCompleto,
      email: this.form.email,
      telefone: this.form.telefone,
      cidadeEstado: `${this.form.cidade.trim()}, ${this.form.estado.trim().toUpperCase()}`,
      interesses: [...this.selectedCausas].join(', '),
      habilidades: [...this.selectedEspecialidades].join(', '),
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

  toggleTag(collection: Set<string>, tag: string): void {
    if (collection.has(tag)) collection.delete(tag);
    else collection.add(tag);
  }

  formatPhone(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) this.form.telefone = digits ? `(${digits}` : '';
    else if (digits.length <= 7) this.form.telefone = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else this.form.telefone = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  private setError(message: string): void {
    this.feedback = 'error';
    this.message = message;
  }
}
