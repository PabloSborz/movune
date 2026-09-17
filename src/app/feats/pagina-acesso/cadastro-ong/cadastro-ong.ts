import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore, OngRegistrationInput } from '../../../shared/auth-store.service';

@Component({
  selector: 'app-cadastro-ong',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-ong.html',
  styleUrl: './cadastro-ong.css',
})
export class CadastroOng {
  readonly areasAtuacao = [
    'Educação e Alfabetização',
    'Saúde e Bem-Estar',
    'Preservação do Meio Ambiente',
    'Assistência e Proteção Social',
    'Cultura e Direitos Artísticos',
    'Defesa dos Direitos Humanos',
  ];
  readonly selectedAreas = new Set([
    'Educação e Alfabetização',
    'Assistência e Proteção Social',
    'Defesa dos Direitos Humanos',
  ]);
  estatuto: File | null = null;
  ata: File | null = null;

  readonly form: OngRegistrationInput & {
    dataFundacao: string;
    site: string;
    cidade: string;
    estado: string;
    cep: string;
    cpfGestor: string;
    confirmarSenha: string;
    aceite: boolean;
  } = {
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    dataFundacao: '',
    site: '',
    responsavel: '',
    cpfGestor: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    areaAtuacao: '',
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
    if (!this.selectedAreas.size) return this.setError('Selecione ao menos uma área de atuação.');
    if (!this.estatuto || !this.ata) return this.setError('Selecione os dois documentos em PDF.');
    if (!this.validDate(this.form.dataFundacao))
      return this.setError('Informe uma data de fundação válida.');
    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(this.form.cnpj))
      return this.setError('Informe um CNPJ no formato correto.');
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(this.form.cpfGestor))
      return this.setError('Informe um CPF no formato correto.');
    if (!/^\d{5}-\d{3}$/.test(this.form.cep))
      return this.setError('Informe um CEP no formato correto.');
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(this.form.telefone))
      return this.setError('Informe um telefone com DDD.');
    if (this.form.senha.length < 6)
      return this.setError('A senha precisa ter ao menos 6 caracteres.');
    if (this.form.senha !== this.form.confirmarSenha) {
      return this.setError('As senhas precisam ser iguais.');
    }

    if (!this.form.aceite) {
      return this.setError('Confirme a veracidade das informações para continuar.');
    }

    const result = this.auth.registerOng({
      razaoSocial: this.form.razaoSocial,
      nomeFantasia: this.form.razaoSocial,
      cnpj: this.form.cnpj,
      dataFundacao: this.form.dataFundacao,
      site: this.form.site,
      responsavel: this.form.responsavel,
      cpfGestor: this.form.cpfGestor,
      email: this.form.email,
      telefone: this.form.telefone,
      endereco: this.form.endereco,
      cidade: this.form.cidade,
      estado: this.form.estado.toUpperCase(),
      cep: this.form.cep,
      areaAtuacao: [...this.selectedAreas].join(', '),
      documentos: `${this.estatuto.name}; ${this.ata.name}`,
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

  toggleArea(area: string): void {
    if (this.selectedAreas.has(area)) this.selectedAreas.delete(area);
    else this.selectedAreas.add(area);
  }

  mask(value: string, pattern: string): string {
    const digits = value.replace(/\D/g, '');
    let result = '';
    let index = 0;
    for (const char of pattern) {
      if (index >= digits.length) break;
      if (char === '0') result += digits[index++];
      else result += char;
    }
    return result;
  }

  selectFile(event: Event, kind: 'estatuto' | 'ata'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const max = kind === 'estatuto' ? 15 : 10;
    if (file.type !== 'application/pdf' || file.size > max * 1024 * 1024) {
      input.value = '';
      this[kind] = null;
      this.setError(`Selecione um PDF de até ${max} MB.`);
      return;
    }
    this[kind] = file;
    this.message = '';
  }

  private validDate(value: string): boolean {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
    if (!match) return false;
    const date = new Date(+match[3], +match[2] - 1, +match[1]);
    return (
      date.getFullYear() === +match[3] &&
      date.getMonth() === +match[2] - 1 &&
      date.getDate() === +match[1] &&
      date <= new Date()
    );
  }

  private setError(message: string): void {
    this.feedback = 'error';
    this.message = message;
  }
}
