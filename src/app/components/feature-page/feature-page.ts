import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthStore } from '../../shared/auth-store.service';
import { PageAction, PageCard, PageContent } from '../../shared/page-content';
import { ActivityRecord, SiteActivityStore } from '../../shared/site-activity.service';

@Component({
  selector: 'app-feature-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-page.html',
  styleUrl: './feature-page.css',
})
export class FeaturePage implements OnChanges {
  @Input({ required: true }) page!: PageContent;

  formModel: Record<string, string> = {};
  searchTerm = '';
  activeFilter = '';
  feedback: 'error' | 'success' | null = null;
  message = '';

  private readonly activity = inject(SiteActivityStore);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router, { optional: true });

  ngOnChanges(): void {
    this.formModel = Object.fromEntries(
      (this.page.fields || []).map((field) => [field, this.formModel[field] || '']),
    ) as Record<string, string>;
    this.feedback = null;
    this.message = '';
    this.searchTerm = '';
    this.activeFilter = '';
  }

  filteredCards(): PageCard[] {
    const search = this.normalize(this.searchTerm.trim());
    const filter = this.normalize(this.activeFilter);

    return (this.page.cards || []).filter((card) => {
      const content = this.normalize(
        [card.title, card.meta, card.description, ...(card.tags || [])].filter(Boolean).join(' '),
      );

      return (!search || content.includes(search)) && (!filter || content.includes(filter));
    });
  }

  availableFilters(): string[] {
    return [...new Set((this.page.cards || []).flatMap((card) => card.tags || []))].slice(0, 6);
  }

  selecionarFiltro(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
  }

  salvarInformacoes(): void {
    if (!this.hasRequiredFields()) {
      this.feedback = 'error';
      this.message = 'Preencha todos os campos antes de salvar.';
      return;
    }

    if (this.isPasswordRecoveryPage()) {
      this.activity.save({
        pageTitle: this.page.title,
        pageEyebrow: this.page.eyebrow,
        fields: this.formModel,
        status: 'Solicitacao registrada',
        session: this.auth.session(),
      });
      this.feedback = 'success';
      this.message =
        'Solicitacao registrada. Use a pagina de redefinicao para cadastrar a nova senha.';
      return;
    }

    if (this.isPasswordResetPage()) {
      this.redefinirSenha();
      return;
    }

    const record = this.activity.save({
      pageTitle: this.page.title,
      pageEyebrow: this.page.eyebrow,
      fields: this.formModel,
      session: this.auth.session(),
    });

    this.feedback = 'success';
    this.message = `${this.formButtonLabel()} concluido. Protocolo ${record.id.slice(-8)}.`;
  }

  isLongField(field: string): boolean {
    const normalizedField = this.normalize(field);

    return (
      normalizedField.includes('mensagem') ||
      normalizedField.includes('descricao') ||
      normalizedField.includes('noticias') ||
      normalizedField.includes('valores')
    );
  }

  formButtonLabel(): string {
    const normalizedTitle = this.normalize(this.page.title);

    if (normalizedTitle.includes('doac')) {
      return 'Registrar doacao';
    }

    if (normalizedTitle.includes('contato')) {
      return 'Enviar mensagem';
    }

    if (normalizedTitle.includes('recuperacao de senha')) {
      return 'Solicitar recuperacao';
    }

    if (normalizedTitle.includes('redefinicao de senha')) {
      return 'Atualizar senha';
    }

    if (normalizedTitle.includes('projeto')) {
      return 'Salvar projeto';
    }

    if (normalizedTitle.includes('prestacao')) {
      return 'Registrar prestacao';
    }

    return 'Salvar informacoes';
  }

  isInlineAction(action: PageAction): boolean {
    return this.normalize(action.label).startsWith('inscrever');
  }

  navegar(event: MouseEvent, href: string): void {
    if (!this.router || this.isExternalHref(href)) {
      return;
    }

    event.preventDefault();
    void this.router.navigateByUrl(href);
  }

  executarAcao(action: PageAction): void {
    if (!this.isInlineAction(action)) {
      return;
    }

    const session = this.auth.session();

    if (session?.perfil !== 'usuario') {
      this.feedback = 'error';
      this.message = 'Entre como usuario para concluir a inscricao.';
      const returnUrl = this.router?.url || '/';
      void this.router?.navigate(['/login'], {
        queryParams: { perfil: 'usuario', retorno: returnUrl },
      });
      return;
    }

    this.activity.save({
      type: 'inscricao',
      pageTitle: this.page.title,
      pageEyebrow: this.page.eyebrow,
      fields: {
        Atividade: this.page.title,
        Tipo: this.page.eyebrow,
        Usuario: session.nome,
      },
      status: 'Pendente',
      session,
    });

    void this.router?.navigateByUrl('/usuario/minhas-inscricoes');
  }

  salvarFavorito(card: PageCard): void {
    const session = this.auth.session();

    if (session?.perfil !== 'usuario') {
      this.feedback = 'error';
      this.message = 'Entre como usuario para salvar favoritos.';
      const returnUrl = this.router?.url || '/';
      void this.router?.navigate(['/login'], {
        queryParams: { perfil: 'usuario', retorno: returnUrl },
      });
      return;
    }

    const alreadySaved = this.activity
      .byType('favorito')
      .some(
        (record) =>
          record.ownerId === session.id &&
          record.fields['Titulo'] === card.title &&
          record.fields['Link'] === (card.href || ''),
      );

    if (alreadySaved) {
      this.feedback = 'success';
      this.message = 'Este favorito ja esta salvo.';
      return;
    }

    this.activity.save({
      type: 'favorito',
      pageTitle: 'Favoritos',
      pageEyebrow: this.page.eyebrow,
      fields: {
        Titulo: card.title,
        Categoria: card.meta || this.page.title,
        Descricao: card.description,
        Link: card.href || '',
      },
      status: 'Salvo',
      session,
    });

    this.feedback = 'success';
    this.message = 'Favorito salvo na sua area.';
  }

  showFavoriteButton(card: PageCard): boolean {
    return Boolean(card.href) && this.page.title !== 'Favoritos';
  }

  savedEntries(): ActivityRecord[] {
    return this.activity.byPage(this.page.title).slice(0, 3);
  }

  private redefinirSenha(): void {
    const email = this.getFormValue('E-mail cadastrado', 'E-mail');
    const senha = this.getFormValue('Nova senha', 'Senha');
    const confirmacao = this.getFormValue('Confirmacao da senha', 'Confirmar senha');

    if (senha !== confirmacao) {
      this.feedback = 'error';
      this.message = 'As senhas precisam ser iguais.';
      return;
    }

    const result = this.auth.updatePassword(email, senha);

    if (!result.ok) {
      this.feedback = 'error';
      this.message = result.message;
      return;
    }

    this.activity.save({
      type: 'seguranca',
      pageTitle: this.page.title,
      pageEyebrow: this.page.eyebrow,
      fields: { 'E-mail cadastrado': email },
      status: 'Senha atualizada',
      session: this.auth.session(),
    });

    this.feedback = 'success';
    this.message = result.message;
  }

  private hasRequiredFields(): boolean {
    return (this.page.fields || []).every((field) => this.formModel[field]?.trim());
  }

  private isPasswordRecoveryPage(): boolean {
    return this.normalize(this.page.title).includes('recuperacao de senha');
  }

  private isPasswordResetPage(): boolean {
    return this.normalize(this.page.title).includes('redefinicao de senha');
  }

  private getFormValue(...labels: string[]): string {
    for (const label of labels) {
      const value = this.formModel[label];

      if (value) {
        return value.trim();
      }
    }

    return '';
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  }

  private isExternalHref(href: string): boolean {
    return /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  }
}
