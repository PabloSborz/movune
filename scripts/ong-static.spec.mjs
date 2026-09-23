import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeStandalone, staticRoute } from '../src/app/feats/ong/standalone/shared/standalone.js';

let cleanup;
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const mount = slug => {
  const parsed = new DOMParser().parseFromString(read(`src/app/feats/ong/standalone/${slug}/index.html`), 'text/html');
  document.body.innerHTML = parsed.body.innerHTML;
  document.body.dataset.kind = parsed.body.dataset.kind;
  cleanup = initializeStandalone();
};
const click = selector => document.querySelector(selector).click();
const set = (name, value) => { document.querySelector(`[name="${name}"]`).value = value; };
const submit = async selector => {
  document.querySelector(selector).dispatchEvent(new Event('submit', { cancelable: true }));
  await Promise.resolve();
};
beforeEach(() => {
  const storage = new Map();
  vi.stubGlobal('localStorage', {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.open = true; } });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.open = false; this.dispatchEvent(new Event('close')); } });
});
afterEach(() => {
  cleanup?.(); cleanup = undefined;
  document.body.innerHTML = ''; delete document.body.dataset.kind;
  vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers();
});

describe('standalone ONG delivery', () => {
  it.each([
    ['cadastrar-projeto-ong', '.create-form'], ['gerenciar-vaga-ong', 'tbody tr'],
    ['gerenciar-voluntario-ong', 'tbody tr'], ['gerenciar-eventos-ong', 'tbody tr'],
    ['gerencia-doacao-ong', '.kpis'], ['prestacao-conta-ong', '.accounting-form'],
    ['relatorio-ong', '.charts'], ['documento-ong', '.document-row'],
    ['configuracao-ong', '[role="switch"]'], ['projetos', '[data-projects]'],
  ])('initializes %s without Angular', (slug, selector) => {
    mount(slug);
    expect(document.querySelector(selector)).not.toBeNull();
    expect(document.querySelector('.logo-group a').getAttribute('href')).toBe('/');
    expect(document.querySelectorAll('#desktop-menu [aria-current="page"]')).toHaveLength(1);
    expect(document.body.innerHTML).not.toMatch(/ng-content|\{\{ organization/);
  });

  it('maps creation, editing and profiles to standalone destinations', () => {
    expect(staticRoute('/ong/vagas/nova')).toBe('/ong/gerenciar-vaga-ong/index.html?route=%2Fong%2Fvagas%2Fnova');
    expect(staticRoute('/ong/eventos/editar/mutirao')).toContain('gerenciar-eventos-ong/index.html?route=');
    expect(staticRoute('/voluntario/ana/perfil')).toContain('gerenciar-voluntario-ong/index.html?route=');
    expect(staticRoute('/ong/projetos')).toBe('/ong/projetos/index.html');
  });

  it('keeps the ONG logo destination only while an ONG is logged in', () => {
    localStorage.setItem('movune:sessao', JSON.stringify({ id: 'ong-test', perfil: 'ong' }));
    mount('gerenciar-vaga-ong');
    const logo = document.querySelector('.logo-group a');
    expect(logo.getAttribute('href')).toBe('/ong/painel');
    localStorage.removeItem('movune:sessao');
    logo.dispatchEvent(new Event('focus'));
    expect(logo.getAttribute('href')).toBe('/');
  });

  it('opens the mobile menu and marks its current page', () => {
    mount('gerenciar-vaga-ong'); click('[data-drawer]');
    expect(document.querySelector('.mobile-drawer').open).toBe(true);
    expect(document.querySelector('[data-mobile-menu] [aria-current="page"]').textContent).toContain('Vagas');
    click('[data-close-drawer]');
    expect(document.querySelector('[data-drawer]').getAttribute('aria-expanded')).toBe('false');
  });

  it('persists a vacancy status and restores it on another visit', async () => {
    mount('gerenciar-vaga-ong'); click('[data-row-action="close"]');
    await submit('.modal-form');
    expect(JSON.parse(localStorage.getItem('movune:ong:demo:vagas'))[0].status).toBe('Encerrada');
    cleanup(); mount('gerenciar-vaga-ong'); click('[data-filter="Encerrada"]');
    expect(document.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('validates publishing, renumbers goals and saves a draft to the project listing', async () => {
    vi.useFakeTimers(); mount('cadastrar-projeto-ong');
    await submit('.create-form');
    expect(document.querySelector('#project-name').getAttribute('aria-invalid')).toBe('true');
    click('.remove-objective');
    expect(document.querySelector('.objective-number').textContent).toBe('1');
    set('name', '<Projeto comunitário>'); click('.draft-button');
    const records = JSON.parse(localStorage.getItem('movune:atividades'));
    expect(records[0]).toMatchObject({ status: 'Rascunho', ownerId: 'demo' });
    cleanup(); mount('projetos');
    expect(document.querySelector('[data-projects]').textContent).toContain('<Projeto comunitário>');
    expect(document.querySelector('[data-projects] projeto')).toBeNull();
  });

  it('keeps the project form usable if storage is full', () => {
    mount('cadastrar-projeto-ong');
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    click('.draft-button');
    expect(document.querySelector('.form-feedback').textContent).toContain('Não foi possível salvar');
    expect(document.querySelector('.draft-button').disabled).toBe(false);
  });

  it('rejects oversized and unsupported cover files', () => {
    mount('cadastrar-projeto-ong');
    const picker = document.querySelector('.file-input');
    for (const file of [new File(['x'], 'file.txt', { type: 'text/plain' }), new File([new Uint8Array(5242881)], 'large.png', { type: 'image/png' })]) {
      Object.defineProperty(picker, 'files', { configurable: true, value: [file] });
      picker.dispatchEvent(new Event('change'));
      expect(document.querySelector('#upload-error').hidden).toBe(false);
    }
  });

  it('persists preferences and validates password confirmation', async () => {
    mount('configuracao-ong'); click('[data-preference="notification0"]');
    expect(JSON.parse(localStorage.getItem('movune:ong:demo:configuracoes')).notification0).toBe(false);
    click('[data-settings="password"]');
    set('current', '12345678'); set('next', 'abcdefgh'); set('confirmation', 'different');
    await submit('.modal-form');
    expect(document.querySelector('.modal-error').textContent).toContain('coincidir');
    click('[data-close]'); click('[data-settings="deactivate"]');
    expect(document.querySelector('[data-confirm]').disabled).toBe(true);
    set('confirmation', 'DESATIVAR'); document.querySelector('[name="confirmation"]').dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelector('[data-confirm]').disabled).toBe(false);
  });
});
