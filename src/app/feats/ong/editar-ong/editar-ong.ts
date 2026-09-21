import { Component, ElementRef, DestroyRef, afterNextRender, inject } from '@angular/core';
import { OngShell } from '../../../components/ong-shell/ong-shell';
import { AuthStore, MovuneOng } from '../../../shared/auth-store.service';

type Profile = Record<string, string | string[]>;
export function maskProfileValue(kind: string, value: string): string {
  const digits = value.replace(/\D/g, '');
  if (kind === 'cep') return digits.slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2');
  if (kind === 'cnpj') return digits.slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
  const phone = digits.slice(0, 11);
  return phone.replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(phone.length > 10 ? /(\d{5})(\d)/ : /(\d{4})(\d)/, '$1-$2');
}

@Component({
  selector: 'app-editar-ong',
  imports: [OngShell],
  templateUrl: './editar-ong.html',
  styleUrl: './editar-ong.css',
})
export class EditarOng {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly auth = inject(AuthStore);
  private readonly destroy = inject(DestroyRef);
  private form?: HTMLFormElement;
  private baseline = '';
  private logo = '/ong-avatar.svg';
  private banner = '/ong-community.svg';
  private pendingUploads = 0;
  private saving = false;
  private ask?: (title: string, message: string, action: string) => Promise<boolean>;

  constructor() { afterNextRender(() => this.initialize()); }

  canLeave(): boolean | Promise<boolean> {
    if (this.saving) return false;
    if (!this.isDirty()) return true;
    return this.ask?.('Alterações não salvas', 'Tem alterações não salvas. Deseja sair?', 'Sair sem salvar') ?? false;
  }

  private values(): Profile {
    if (!this.form) return {};
    const data = new FormData(this.form);
    const values: Profile = {};
    data.forEach((value, key) => { if (typeof value === 'string' && key !== 'areasImpacto') values[key] = value; });
    values['areasImpacto'] = data.getAll('areasImpacto').map(String);
    values['logo'] = this.logo;
    values['banner'] = this.banner;
    return values;
  }

  private isDirty(): boolean {
    return !!this.form && (this.pendingUploads > 0 || JSON.stringify(this.values()) !== this.baseline);
  }

  private initialize(): void {
    const root = this.host.nativeElement;
    const form = root.querySelector<HTMLFormElement>('form')!;
    this.form = form;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const dialog = root.querySelector<HTMLDialogElement>('.confirmation')!;
    const toast = root.querySelector<HTMLElement>('.toast')!;
    const saveError = root.querySelector<HTMLElement>('.save-error')!;
    const feedback = root.querySelector<HTMLElement>('.upload-feedback')!;
    const saveButton = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    const readers = new Set<FileReader>();
    let alive = true;
    let toastTimer = 0;
    let resolver: ((value: boolean) => void) | undefined;
    let pendingConfirmation: Promise<boolean> | undefined;
    let focusBefore: HTMLElement | null = null;
    const generations: Record<string, number> = { logo: 0, banner: 0 };
    const updateCount = () => {
      root.querySelector('#description-count')!.textContent =
        form.querySelector<HTMLTextAreaElement>('#descricao')!.value.length + '/500 caracteres';
    };
    const apply = (data: Profile) => {
      for (const [name, value] of Object.entries(data)) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.value = String(value);
        }
      }
      if (Array.isArray(data['areasImpacto'])) {
        form.querySelectorAll<HTMLInputElement>('[name="areasImpacto"]').forEach(input =>
          input.checked = (data['areasImpacto'] as string[]).includes(input.value));
      }
      this.logo = typeof data['logo'] === 'string' ? data['logo'] : this.logo;
      this.banner = typeof data['banner'] === 'string' ? data['banner'] : this.banner;
      root.querySelector<HTMLImageElement>('#logo-preview')!.src = this.logo || '/ong-avatar.svg';
      root.querySelector<HTMLImageElement>('#banner-preview')!.src = this.banner || '/ong-community.svg';
      updateCount();
    };
    const ong = this.auth.ongs().find(item => item.id === this.auth.session()?.id);
    if (ong && (ong.id !== 'demo-ong' || ong.descricao !== undefined)) {
      const data = this.values();
      for (const name of Object.keys(data)) {
        const value = ong[name as keyof MovuneOng];
        data[name] = Array.isArray(value) ? value : typeof value === 'string' ? value : '';
      }
      data['contatoEmail'] = ong.contatoEmail ?? ong.email;
      data['areasImpacto'] = ong.areasImpacto ?? [];
      apply(data);
    }
    updateCount();
    this.baseline = JSON.stringify(this.values());
    this.ask = (title, message, action) => {
      if (pendingConfirmation) return pendingConfirmation;
      root.querySelector('#confirm-title')!.textContent = title;
      root.querySelector('#confirm-description')!.textContent = message;
      root.querySelector('[data-confirm-yes]')!.textContent = action;
      focusBefore = root.ownerDocument.activeElement as HTMLElement;
      pendingConfirmation = new Promise<boolean>(resolve => { resolver = resolve; });
      dialog.showModal();
      return pendingConfirmation;
    };
    const finish = (confirmed: boolean) => {
      const resolve = resolver;
      resolver = undefined;
      pendingConfirmation = undefined;
      dialog.close();
      focusBefore?.focus();
      resolve?.(confirmed);
    };
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(false); }, options);
    dialog.addEventListener('click', event => {
      const target = event.target as Element;
      if (target.closest('[data-confirm-no]') || target === dialog) finish(false);
      if (target.closest('[data-confirm-yes]')) finish(true);
    }, options);

    const validate = (field: HTMLInputElement | HTMLTextAreaElement): boolean => {
      let error = '';
      const value = field.value.trim();
      if (field.required && !value) error = 'Campo obrigatório';
      else if (value && field.type === 'email' && !field.validity.valid) error = 'Informe um e-mail válido';
      else if (value && field.name === 'cnpj' && value.replace(/\D/g, '').length !== 14) error = 'Informe os 14 dígitos do CNPJ';
      else if (value && field.name === 'cep' && value.replace(/\D/g, '').length !== 8) error = 'Informe os 8 dígitos do CEP';
      else if (value && field.name === 'telefone' && ![10, 11].includes(value.replace(/\D/g, '').length)) error = 'Informe o telefone com DDD';
      else if (!field.validity.valid) error = 'Verifique o valor informado';
      field.setAttribute('aria-invalid', String(!!error));
      const message = root.querySelector('#' + field.id + '-error');
      if (message) message.textContent = error;
      return !error;
    };
    form.addEventListener('input', event => {
      const input = event.target;
      if (input instanceof HTMLInputElement && input.dataset['mask']) {
        input.value = maskProfileValue(input.dataset['mask'], input.value);
      }
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        if (input.getAttribute('aria-invalid') === 'true') validate(input);
      }
      updateCount();
      toast.hidden = true;
    }, options);
    root.addEventListener('click', async event => {
      const target = event.target as Element;
      const upload = target.closest<HTMLElement>('[data-upload]');
      if (upload && !this.saving) root.querySelector<HTMLInputElement>('#' + upload.dataset['upload'])!.click();
      if (target.closest('[data-remove-logo]') && !this.saving) {
        if (await this.ask!('Remover logotipo?', 'O logotipo será removido ao salvar as alterações.', 'Remover logo')) {
          generations['logo']++;
          this.logo = '';
          root.querySelector<HTMLImageElement>('#logo-preview')!.src = '/ong-avatar.svg';
        }
      }
      if (target.closest('[data-cancel]') && !this.saving) {
        if (!this.isDirty() || await this.ask!('Descartar alterações?', 'Todas as alterações não salvas serão descartadas.', 'Descartar alterações')) {
          generations['logo']++; generations['banner']++;
          apply(JSON.parse(this.baseline) as Profile);
          form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
          form.querySelectorAll('.field-error').forEach(error => error.textContent = '');
          feedback.textContent = '';
          saveError.hidden = true;
        }
      }
    }, options);
    root.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach(input => {
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        input.value = '';
        if (!file || this.saving) return;
        if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
          feedback.textContent = 'Selecione uma imagem de até 2 MB.';
          return;
        }
        const kind = input.id === 'logo-file' ? 'logo' : 'banner';
        const generation = ++generations[kind];
        const reader = new FileReader();
        readers.add(reader);
        this.pendingUploads++;
        saveButton.disabled = true;
        feedback.textContent = 'Carregando imagem…';
        const complete = (error = '') => {
          readers.delete(reader);
          this.pendingUploads--;
          if (!alive) return;
          saveButton.disabled = this.pendingUploads > 0 || this.saving;
          if (generation === generations[kind]) feedback.textContent = error;
        };
        reader.onload = () => {
          const image = new Image();
          image.onload = () => {
            if (alive && generation === generations[kind]) {
              if (kind === 'logo') this.logo = String(reader.result);
              else this.banner = String(reader.result);
              root.querySelector<HTMLImageElement>('#' + kind + '-preview')!.src = String(reader.result);
            }
            complete();
          };
          image.onerror = () => complete('Não foi possível abrir a imagem. Selecione outro arquivo.');
          image.src = String(reader.result);
        };
        reader.onerror = () => complete('Não foi possível ler o arquivo.');
        reader.onabort = () => complete();
        reader.readAsDataURL(file);
      }, options);
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (this.saving || this.pendingUploads) return;
      let firstInvalid: HTMLElement | undefined;
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type="checkbox"]), textarea').forEach(field => {
        if (!validate(field) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }
      this.saving = true;
      saveError.hidden = true;
      toast.hidden = true;
      form.setAttribute('aria-busy', 'true');
      saveButton.disabled = true;
      root.querySelector<HTMLElement>('.spinner')!.hidden = false;
      root.querySelector('[data-save-label]')!.textContent = 'Salvando…';
      form.querySelectorAll<HTMLFieldSetElement>('fieldset').forEach(field => field.disabled = true);
      // Let the browser paint the pending state before the local write.
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!alive) return;
      form.querySelectorAll<HTMLFieldSetElement>('fieldset').forEach(field => field.disabled = false);
      const data = this.values();
      const result = this.auth.updateOngProfile(this.auth.session()?.id ?? '', data);
      if (result.ok) {
        this.baseline = JSON.stringify(data);
        toast.hidden = false;
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.hidden = true, 4500);
      } else {
        saveError.textContent = result.message;
        saveError.hidden = false;
      }
      this.saving = false;
      form.removeAttribute('aria-busy');
      saveButton.disabled = false;
      root.querySelector<HTMLElement>('.spinner')!.hidden = true;
      root.querySelector('[data-save-label]')!.textContent = 'Salvar Alterações';
    }, options);
    window.addEventListener('beforeunload', event => {
      if (this.isDirty()) { event.preventDefault(); event.returnValue = ''; }
    }, options);
    this.destroy.onDestroy(() => {
      alive = false;
      controller.abort();
      readers.forEach(reader => { if (reader.readyState === FileReader.LOADING) reader.abort(); });
      window.clearTimeout(toastTimer);
      resolver?.(false);
      dialog.close();
    });
  }
}
