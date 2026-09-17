import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthStore } from '../../../shared/auth-store.service';
import { NavigationHistoryService } from '../../../shared/navigation-history.service';

@Component({
  selector: 'app-meu-perfil',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './meu-perfil.html',
  styleUrl: './meu-perfil.css',
})
export class MeuPerfil {
  readonly navLinks = [
    { label: 'Como funciona', path: '/como-funciona' },
    { label: 'ONGs', path: '/ongs' },
    { label: 'Projetos', path: '/projetos' },
    { label: 'Voluntariado', path: '/voluntariado' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Empresas', path: '/empresas-parceiras' },
    { label: 'Transparência', path: '/transparencia' },
  ];
  readonly interests = ['Educação', 'Saúde', 'Meio Ambiente'];
  readonly avatarPreview = signal('');
  readonly session;
  readonly userId;
  form = { nomeCompleto: '', email: '', telefone: '', cidade: '', estado: '' };
  skills: string[] = [];
  selectedInterests = new Set<string>();
  notifications = { email: true, push: true, sms: false };
  sidebarOpen = false;
  navOpen = false;
  skillEditorOpen = false;
  newSkill = '';
  removingSkill = '';
  noticeOpen = false;
  toast = '';
  error = '';

  constructor(
    private readonly auth: AuthStore,
    private readonly router: Router,
    private readonly navigationHistory: NavigationHistoryService,
  ) {
    this.session = auth.session;
    this.userId = auth.session()?.id || '';
    const user = auth.users().find((item) => item.id === this.userId);
    if (user) {
      const [city = '', state = ''] = user.cidadeEstado.split(',').map((part) => part.trim());
      this.form = {
        nomeCompleto: user.nomeCompleto,
        email: user.email,
        telefone: user.telefone,
        cidade: city,
        estado: state,
      };
      this.skills = user.habilidades
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      this.selectedInterests = new Set(
        user.interesses
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      );
      this.notifications = { email: true, push: true, sms: false, ...user.notificacoes };
      this.avatarPreview.set(user.avatar || '');
    }
  }

  get initials(): string {
    return (
      this.form.nomeCompleto
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'MV'
    );
  }

  formatPhone(): void {
    const digits = this.form.telefone.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) this.form.telefone = digits ? `(${digits}` : '';
    else if (digits.length <= 7) this.form.telefone = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else this.form.telefone = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  toggleInterest(interest: string): void {
    if (this.selectedInterests.has(interest)) this.selectedInterests.delete(interest);
    else this.selectedInterests.add(interest);
  }

  addSkill(): void {
    const skill = this.newSkill.trim();
    if (skill && !this.skills.some((item) => item.toLowerCase() === skill.toLowerCase()))
      this.skills.push(skill);
    this.newSkill = '';
    this.skillEditorOpen = false;
  }

  removeSkill(skill: string): void {
    this.removingSkill = skill;
    setTimeout(() => {
      this.skills = this.skills.filter((item) => item !== skill);
      this.removingSkill = '';
    }, 180);
  }

  changePhoto(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
      this.error = 'Escolha uma imagem de até 1 MB.';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(String(reader.result || ''));
    reader.readAsDataURL(file);
    this.error = '';
  }

  save(): void {
    this.error = '';
    this.toast = '';
    if (
      !this.form.nomeCompleto.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim()) ||
      !this.form.cidade.trim() ||
      !this.form.estado.trim()
    ) {
      this.error = 'Preencha nome, e-mail, cidade e estado corretamente.';
      return;
    }
    if (this.form.telefone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(this.form.telefone)) {
      this.error = 'Informe um telefone no formato (XX) XXXXX-XXXX.';
      return;
    }
    const result = this.auth.updateUserProfile(this.userId, {
      nomeCompleto: this.form.nomeCompleto.trim(),
      email: this.form.email.trim(),
      telefone: this.form.telefone,
      cidadeEstado: `${this.form.cidade.trim()}, ${this.form.estado.trim().toUpperCase()}`,
      habilidades: this.skills.join(', '),
      interesses: [...this.selectedInterests].join(', '),
      avatar: this.avatarPreview(),
      notificacoes: { ...this.notifications },
    });
    if (result.ok) this.toast = result.message;
    else this.error = result.message;
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  voltar(): void {
    this.navigationHistory.back();
  }
}
