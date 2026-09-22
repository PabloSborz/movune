import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeOngPage } from './ong-pages';
import { documentStatus, PageKind, parseMoney, csvCell } from './ong-data';

describe('ONG management pages', () => {
  let root: HTMLElement;
  let cleanup: (() => void) | undefined;
  let storage: Map<string, string>;
  const navigate = vi.fn();
  const deactivate = vi.fn();
  const changePassword = vi.fn(() => '');
  beforeEach(() => {
    storage = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {} }));
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value() {
        this.open = true;
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value() {
        this.open = false;
        this.dispatchEvent(new Event('close'));
      },
    });
    root = document.createElement('div');
    document.body.append(root);
    navigate.mockClear();
    deactivate.mockClear();
    changePassword.mockClear();
  });
  afterEach(() => {
    cleanup?.();
    root.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
  function mount(kind: PageKind, path = '/ong/' + kind) {
    root.innerHTML =
      '<section><button data-action="new">Novo</button><button data-export="csv">CSV</button><button data-export="excel">Excel</button><div class="page-body"></div><p class="page-feedback" hidden></p></section><dialog class="management-dialog"><form class="modal-form" novalidate><h2 id="modal-title"></h2><div class="modal-content"></div><p class="modal-error" hidden></p><button type="button" data-close>Cancelar</button><button type="submit" data-confirm>Confirmar</button></form></dialog>';
    cleanup = initializeOngPage(root, kind, {
      owner: 'test-ong',
      email: 'test@ong.org',
      path,
      navigate,
      deactivate,
      changePassword,
    });
  }
  const click = (selector: string) => root.querySelector<HTMLButtonElement>(selector)!.click();
  const set = (name: string, value: string) => {
    root.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value = value;
  };
  const confirm = async () => {
    root.querySelector('form.modal-form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await Promise.resolve();
  };
  const records = (kind: PageKind) =>
    JSON.parse(storage.get('movune:ong:test-ong:' + kind) || '[]');

  it('filters vacancies and persists closing and reopening only after confirmation', async () => {
    mount('vagas');
    click('[data-filter="Encerrada"]');
    expect(root.querySelectorAll('tbody tr')).toHaveLength(1);
    click('[data-filter=""]');
    click('[data-row-action="close"]');
    expect(records('vagas')).toHaveLength(0);
    await confirm();
    expect(records('vagas')[0].status).toBe('Encerrada');
    click('[data-row-action="reopen"]');
    await confirm();
    expect(records('vagas')[0].status).toBe('Aberta');
  });
  it('opens new vacancy and edit routes with usable forms', async () => {
    mount('vagas', '/ong/vagas/nova');
    set('name', 'Nova mentoria');
    await confirm();
    expect(records('vagas')[0].name).toBe('Nova mentoria');
    expect(navigate).toHaveBeenCalledWith('/ong/vagas');
  });
  it('rejects incomplete vacancy forms', async () => {
    mount('vagas', '/ong/vagas/nova');
    await confirm();
    expect(root.querySelector('[name="name"]')!.getAttribute('aria-invalid')).toBe('true');
    expect(records('vagas')).toHaveLength(0);
  });
  it('combines interest chips and resets to all volunteers', () => {
    mount('voluntarios');
    click('[data-filter="Educação"]');
    click('[data-filter="Tecnologia"]');
    expect(root.querySelectorAll('tbody tr')).toHaveLength(2);
    click('[data-filter="Educação"]');
    expect(root.querySelectorAll('tbody tr')).toHaveLength(1);
    click('[data-filter=""]');
    expect(root.querySelectorAll('tbody tr')).toHaveLength(4);
  });
  it('approves, rejects with justification and reactivates volunteers', async () => {
    mount('voluntarios');
    click('[data-row-action="reject"]');
    set('reason', 'Sem disponibilidade');
    await confirm();
    expect(records('voluntarios')[2].status).toBe('Rejeitado');
    expect(records('voluntarios')[2].reason).toBe('Sem disponibilidade');
    click('[data-id="maria"][data-row-action="reactivate"]');
    await confirm();
    expect(records('voluntarios')[2].status).toBe('Ativo');
  });
  it('registers messages locally and distinguishes them from external delivery', async () => {
    mount('voluntarios');
    click('[data-row-action="message"]');
    set('message', 'Olá, Ana');
    await confirm();
    expect(storage.get('movune:ong:test-ong:mensagens')).toContain('Olá, Ana');
    expect(root.querySelector('.page-feedback')!.textContent).toContain('envio externo');
  });
  it('opens the volunteer profile route', () => {
    mount('voluntarios', '/voluntario/ana/perfil');
    expect(root.querySelector('#modal-title')!.textContent).toBe('Ana Silva');
  });
  it('publishes a draft event and cancels it after confirmation', async () => {
    mount('eventos');
    click('[data-row-action="publish"]');
    await confirm();
    expect(records('eventos')[2].status).toBe('Aberto');
    click('[data-id="feira"][data-row-action="cancel"]');
    await confirm();
    expect(records('eventos')[2].status).toBe('Cancelado');
    expect(root.querySelector('[data-id="feira"][data-row-action="cancel"]')).toBeNull();
  });
  it('does not permit lowering capacity below existing registrations', async () => {
    mount('eventos', '/ong/eventos/editar/mutirao');
    set('capacity', '10');
    await confirm();
    expect(root.querySelector('[name="capacity"]')!.getAttribute('aria-invalid')).toBe('true');
    expect(records('eventos')).toHaveLength(0);
  });
  it('sorts donations numerically and confirms pending receipts', async () => {
    mount('doacoes');
    click('[data-sort="date"]');
    click('[data-sort="date"]');
    expect(root.querySelector('tbody tr')!.getAttribute('data-id')).toBe('empresa');
    click('[data-id="empresa"][data-row-action="detail"]');
    await confirm();
    expect(records('doacoes')[3].status).toBe('Confirmada');
  });
  it('validates financial records then prepends a formatted entry', () => {
    mount('prestacao');
    const form = root.querySelector('.accounting-form')!;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(records('prestacao')).toHaveLength(0);
    set('name', 'Material escolar');
    set('value', '3.200,00');
    set('date', '2026-09-22');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(records('prestacao')[0].value).toBe(3200);
    expect(records('prestacao')[0].status).toBe('Em análise');
    expect(root.querySelector('tbody th')!.textContent).toBe('Material escolar');
  });
  it('calculates document expiry from the current date with a 90-day horizon', () => {
    const now = new Date(2026, 8, 22);
    expect(documentStatus('', now)).toBe('Válido');
    expect(documentStatus('2026-06-30', now)).toBe('Vencido');
    expect(documentStatus('2026-12-20', now)).toBe('Vencendo');
    expect(documentStatus('2027-03-15', now)).toBe('Válido');
    expect(documentStatus('2026-09-22', now)).toBe('Vencendo');
  });
  it('requires a document file and rejects unsupported uploads', async () => {
    mount('documentos');
    click('[data-action="new"]');
    await confirm();
    expect(root.querySelector('.modal-error')!.textContent).toContain('Selecione');
    const picker = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(picker, 'files', {
      value: [new File(['text'], 'file.exe', { type: 'application/octet-stream' })],
    });
    picker.dispatchEvent(new Event('change'));
    expect(root.querySelector('.file-drop .validation-error')!.textContent).toContain('PDF');
  });
  it('keeps existing data when persistence fails', async () => {
    mount('vagas');
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    click('[data-row-action="close"]');
    await confirm();
    expect(root.querySelector('dialog')!.open).toBe(true);
    expect(root.querySelector('tbody .badge')!.textContent).toBe('Aberta');
  });
  it('saves preferences and rolls back a switch on storage failure', () => {
    mount('configuracoes');
    const input = root.querySelector<HTMLInputElement>('[data-preference="notification0"]')!;
    input.click();
    expect(JSON.parse(storage.get('movune:ong:test-ong:configuracoes')!).notification0).toBe(false);
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    input.click();
    expect(input.checked).toBe(false);
  });
  it('checks password confirmation and toggles password visibility', async () => {
    mount('configuracoes');
    click('[data-settings="password"]');
    set('current', 'oldpassword');
    set('next', 'newpassword');
    set('confirmation', 'different');
    await confirm();
    expect(changePassword).not.toHaveBeenCalled();
    set('confirmation', 'newpassword');
    click('[data-eye="next"]');
    expect(root.querySelector<HTMLInputElement>('[name="next"]')!.type).toBe('text');
    await confirm();
    expect(changePassword).toHaveBeenCalledWith('oldpassword', 'newpassword');
  });
  it('requires the exact deactivation phrase', async () => {
    mount('configuracoes');
    click('[data-settings="deactivate"]');
    expect(root.querySelector<HTMLButtonElement>('[data-confirm]')!.disabled).toBe(true);
    set('confirmation', 'desativar');
    await confirm();
    expect(deactivate).not.toHaveBeenCalled();
    set('confirmation', 'DESATIVAR');
    root.querySelector('[name="confirmation"]')!.dispatchEvent(new Event('input'));
    expect(root.querySelector<HTMLButtonElement>('[data-confirm]')!.disabled).toBe(false);
  });
  it('renders six report bars and three accessible donut segments', () => {
    mount('relatorios');
    expect(root.querySelectorAll('.bar')).toHaveLength(6);
    expect(root.querySelectorAll('.donut circle title')).toHaveLength(3);
    expect(root.querySelectorAll('.metric')).toHaveLength(4);
  });
  it('parses local currency and protects exported CSV values', () => {
    expect(parseMoney('3.200,50')).toBe(3200.5);
    expect(parseMoney('3200')).toBe(3200);
    expect(csvCell('=SUM(A1)')).toBe('"\'=SUM(A1)"');
  });
});
