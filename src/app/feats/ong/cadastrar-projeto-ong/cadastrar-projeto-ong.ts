import { Component, ElementRef, DestroyRef, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OngShell } from '../../../components/ong-shell/ong-shell';
import { AuthStore } from '../../../shared/auth-store.service';
import { SiteActivityStore } from '../../../shared/site-activity.service';

@Component({
  selector: 'app-cadastrar-projeto-ong',
  imports: [OngShell],
  templateUrl: './cadastrar-projeto-ong.html',
  styleUrl: './cadastrar-projeto-ong.css',
  encapsulation: ViewEncapsulation.None,
})
export class CadastrarProjetoOng {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthStore);
  private readonly activity = inject(SiteActivityStore);

  constructor() { afterNextRender(() => this.initialize()); }

  private initialize(): void {
    const root = this.host.nativeElement;
    const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
    const form = find<HTMLFormElement>('.create-form');
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const key = 'movune:project-draft:' + (this.auth.session()?.id ?? 'demo');
    const list = find<HTMLOListElement>('.objectives');
    const add = find<HTMLButtonElement>('.add-objective');
    const feedback = find<HTMLElement>('.form-feedback');
    const zone = find<HTMLElement>('.upload-zone');
    const picker = find<HTMLInputElement>('.file-input');
    const preview = find<HTMLImageElement>('.cover-preview');
    const upload = find<HTMLButtonElement>('.upload-trigger');
    const removeCover = find<HTMLButtonElement>('.remove-cover');
    const uploadError = find<HTMLElement>('#upload-error');
    let cover = '';
    let reader: FileReader | null = null;
    let loadingCover = false;
    let busy = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const announce = (message: string, error = false) => {
      feedback.textContent = message; feedback.hidden = false; feedback.classList.toggle('error', error);
    };
    const renumber = () => {
      [...list.children].forEach((item, index) => {
        item.querySelector('.objective-number')!.textContent = String(index + 1);
        item.querySelector('input')!.setAttribute('aria-label', 'Meta ' + (index + 1));
        item.querySelector('button')!.setAttribute('aria-label', 'Remover meta ' + (index + 1));
      });
      add.disabled = list.children.length >= 10;
      find<HTMLElement>('.limit-note').hidden = !add.disabled;
    };
    const addGoal = (value = '', focus = false) => {
      if (list.children.length >= 10) return;
      const item = document.createElement('li'); item.className = 'objective';
      const number = document.createElement('span'); number.className = 'objective-number';
      const input = document.createElement('input'); input.value = value; input.maxLength = 200; input.placeholder = 'Descreva a nova meta';
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-objective';
      remove.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"/></svg>';
      item.append(number, input, remove); list.append(item); renumber();
      if (focus) input.focus();
    };
    add.addEventListener('click', () => addGoal('', true), options);
    list.addEventListener('click', event => {
      const button = (event.target as Element).closest('.remove-objective');
      if (button) { button.closest('li')!.remove(); renumber(); add.focus(); }
    }, options);
    const showCover = (data: string) => {
      cover = data; preview.hidden = !data; upload.hidden = !!data; removeCover.hidden = !data;
      if (data) preview.src = data; else preview.removeAttribute('src');
    };
    let saved: Record<string, unknown> | null = null;
    try { saved = JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { announce('Não foi possível recuperar o rascunho salvo.', true); }
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const name of ['name', 'category', 'goal', 'days', 'description']) {
        if (typeof saved[name] === 'string') (form.elements.namedItem(name) as HTMLInputElement).value = saved[name] as string;
      }
      if (typeof saved['cover'] === 'string' && /^data:image\/(png|jpeg);base64,/.test(saved['cover'])) showCover(saved['cover']);
    }
    const goals = Array.isArray(saved?.['objectives']) ? saved['objectives'].filter((v): v is string => typeof v === 'string').slice(0, 10) : ['Comprar 200 kits escolares', 'Reformar a sala de leitura', 'Atender 50 crianças da comunidade'];
    goals.forEach(value => addGoal(value));
    const validate = (input: HTMLInputElement | HTMLTextAreaElement) => {
      let message = '';
      if (input.required && !input.value.trim()) message = input.name === 'name' ? 'Informe o nome do projeto.' : 'Descreva o projeto.';
      else if (!input.validity.valid) message = input.name === 'days' ? 'Informe um número inteiro de dias maior que zero.' : 'Informe um valor financeiro válido, maior ou igual a zero.';
      const error = find<HTMLElement>('#' + input.name + '-error');
      error.textContent = message; error.hidden = !message; input.setAttribute('aria-invalid', String(!!message));
      return !message;
    };
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[aria-describedby], textarea')];
    fields.forEach(input => {
      input.addEventListener('blur', () => validate(input), options);
      input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validate(input); }, options);
    });
    const select = find<HTMLSelectElement>('select');
    select.addEventListener('pointerdown', () => select.parentElement!.classList.toggle('open'), options);
    select.addEventListener('keydown', event => {
      if (['ArrowDown', 'ArrowUp', ' '].includes(event.key)) select.parentElement!.classList.add('open');
      if (['Escape', 'Tab', 'Enter'].includes(event.key)) select.parentElement!.classList.remove('open');
    }, options);
    for (const event of ['change', 'blur']) select.addEventListener(event, () => select.parentElement!.classList.remove('open'), options);
    const loadFile = (file?: File) => {
      if (!file) return;
      const error = !['image/jpeg', 'image/png'].includes(file.type) ? 'Selecione uma imagem JPG ou PNG.' : file.size > 5 * 1024 * 1024 ? 'A imagem deve ter no máximo 5MB.' : '';
      uploadError.textContent = error; uploadError.hidden = !error;
      picker.value = '';
      if (error) return;
      reader?.abort(); reader = new FileReader();
      const currentReader = reader;
      loadingCover = true;
      reader.onload = () => {
        if (controller.signal.aborted) return;
        const data = String(reader!.result);
        const image = new Image();
        image.onload = () => { if (!controller.signal.aborted && reader === currentReader) { loadingCover = false; showCover(data); } };
        image.onerror = () => { if (controller.signal.aborted || reader !== currentReader) return; loadingCover = false; uploadError.textContent = 'Não foi possível abrir esta imagem. Escolha outro arquivo.'; uploadError.hidden = false; };
        image.src = data;
      };
      reader.onerror = () => { loadingCover = false; uploadError.textContent = 'Não foi possível ler a imagem.'; uploadError.hidden = false; };
      reader.readAsDataURL(file);
    };
    upload.addEventListener('click', () => picker.click(), options);
    picker.addEventListener('change', () => loadFile(picker.files?.[0]), options);
    removeCover.addEventListener('click', () => { reader?.abort(); reader = null; loadingCover = false; showCover(''); picker.value = ''; uploadError.hidden = true; upload.focus(); }, options);
    for (const name of ['dragenter', 'dragover']) zone.addEventListener(name, event => { event.preventDefault(); zone.classList.add('dragging'); }, options);
    zone.addEventListener('dragleave', event => { if (!zone.contains((event as DragEvent).relatedTarget as Node)) zone.classList.remove('dragging'); }, options);
    zone.addEventListener('drop', event => { event.preventDefault(); zone.classList.remove('dragging'); loadFile(event.dataTransfer?.files[0]); }, options);
    const save = (draft: boolean) => {
      if (busy) return;
      if (loadingCover) { announce('Aguarde a leitura da imagem antes de salvar.', true); return; }
      if (!draft) {
        const invalid = fields.filter(input => !validate(input));
        if (invalid.length) { invalid[0].scrollIntoView?.({ block: 'center', behavior: 'smooth' }); invalid[0].focus(); return; }
      }
      const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
      const objectives = [...list.querySelectorAll('input')].map(input => input.value.trim()).filter(Boolean);
      const previousRecords = this.activity.records();
      let previousDraft: string | null = null;
      try {
        previousDraft = localStorage.getItem(key);
        localStorage.setItem(key, JSON.stringify({ ...data, objectives, cover }));
        this.activity.save({ type: 'projeto', pageTitle: data['name'].trim() || 'Projeto sem título', pageEyebrow: 'Painel da ONG', status: draft ? 'Rascunho' : 'Em andamento', session: this.auth.session(), fields: {
          'Nome do projeto': data['name'].trim() || 'Projeto sem título', 'Categoria': data['category'], 'Meta financeira': data['goal'], 'Prazo': data['days'], 'Descrição': data['description'], 'Metas': JSON.stringify(objectives), 'Imagem de capa': cover,
        } });
      } catch {
        this.activity.records.set(previousRecords);
        try { if (previousDraft === null) localStorage.removeItem(key); else localStorage.setItem(key, previousDraft); } catch { /* Keep the form available when storage is unavailable. */ }
        announce('Não foi possível salvar. O armazenamento pode estar cheio ou indisponível. Tente uma imagem menor ou libere espaço e tente novamente.', true); return;
      }
      try { localStorage.removeItem(key); } catch { /* The project is already saved. */ }
      busy = true;
      form.querySelectorAll<HTMLButtonElement>('.form-actions button').forEach(button => button.disabled = true);
      announce(draft ? 'Rascunho salvo!' : 'Projeto publicado com sucesso!');
      timer = setTimeout(() => { void this.router.navigateByUrl('/ong/projetos'); }, 1200);
    };
    find<HTMLButtonElement>('.draft-button').addEventListener('click', () => save(true), options);
    form.addEventListener('submit', event => { event.preventDefault(); save(false); }, options);
    this.destroy.onDestroy(() => { controller.abort(); reader?.abort(); clearTimeout(timer); });
  }
}
