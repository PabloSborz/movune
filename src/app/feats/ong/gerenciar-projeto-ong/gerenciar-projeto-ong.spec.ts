import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { vi, afterEach } from 'vitest';
import { GerenciarProjetoOng } from './gerenciar-projeto-ong';
import { AuthStore } from '../../../shared/auth-store.service';
import { SiteActivityStore } from '../../../shared/site-activity.service';

describe('GerenciarProjetoOng', () => {
  let fixture: ComponentFixture<GerenciarProjetoOng>;
  let root: HTMLElement;
  let records: Map<string, string>;
  let route: { snapshot: { paramMap: ReturnType<typeof convertToParamMap> } };
  beforeEach(async () => {
    records = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => records.get(key) ?? null,
      setItem: (key: string, value: string) => records.set(key, value),
      removeItem: (key: string) => records.delete(key),
    });
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() {} });
    route = { snapshot: { paramMap: convertToParamMap({}) } };
    await TestBed.configureTestingModule({
      imports: [GerenciarProjetoOng],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();
    TestBed.inject(AuthStore).session.set({ id: 'demo-ong', perfil: 'ong', nome: 'Rede Cuidar', email: 'ong@gmail.com', iniciadoEm: '' });
    await mount();
  });
  async function mount() {
    fixture = TestBed.createComponent(GerenciarProjetoOng);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  }
  afterEach(() => { fixture.destroy(); vi.unstubAllGlobals(); });
  function click(selector: string) { root.querySelector<HTMLButtonElement>(selector)!.click(); }
  function names() { return [...root.querySelectorAll('tbody th')].map(item => item.textContent); }

  it('filters ongoing, completed and empty drafts', () => {
    expect(names().length).toBe(4);
    click('[data-filter="ongoing"]');
    expect(names().length).toBe(3);
    click('[data-filter="completed"]');
    expect(names()).toEqual(['Cozinha solidária']);
    expect(root.querySelector('.goal-met')!.textContent).toBe('R$ 15.000');
    click('[data-filter="draft"]');
    expect(root.querySelector<HTMLElement>('.empty-state')!.hidden).toBe(false);
    click('[data-filter="all"]');
    expect(names().length).toBe(4);
  });

  it('sorts money numerically in both directions', () => {
    click('[data-sort="goal"]');
    expect(names()[0]).toBe('Horta escola');
    expect(root.querySelector('[aria-sort="ascending"]')).toBeTruthy();
    click('[data-sort="goal"]');
    expect(names()[0]).toBe('Saúde na comunidade');
    expect(root.querySelector('[aria-sort="descending"]')).toBeTruthy();
  });

  it('persists featured state for this organization', async () => {
    click('[data-feature="biblioteca-de-bairro"]');
    expect(root.querySelector('[data-feature="biblioteca-de-bairro"]')!.getAttribute('aria-pressed')).toBe('true');
    fixture.destroy();
    await mount();
    expect(root.querySelector('[data-feature="biblioteca-de-bairro"]')!.textContent).toBe('Destacado');
    click('[data-feature="biblioteca-de-bairro"]');
    expect(root.querySelector('[data-feature="biblioteca-de-bairro"]')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('preserves only projects registered by the logged in organization', async () => {
    const activity = TestBed.inject(SiteActivityStore);
    const session = TestBed.inject(AuthStore).session()!;
    activity.save({ type: 'projeto', pageTitle: 'Cadastrar Projeto', pageEyebrow: 'ONG', fields: { 'Nome do projeto': 'Projeto local', 'Meta financeira': '8.000', 'Prazo': '20 dias' }, session });
    activity.save({ type: 'projeto', pageTitle: 'Outro projeto', pageEyebrow: 'ONG', fields: { 'Nome do projeto': 'Outra ONG' }, session: { ...session, id: 'other' } });
    fixture.destroy();
    await mount();
    expect(names()).toContain('Projeto local');
    expect(names()).not.toContain('Outra ONG');
  });

  it('loads the selected project for editing', async () => {
    fixture.destroy();
    route.snapshot.paramMap = convertToParamMap({ id: 'horta-escola' });
    await mount();
    expect(root.querySelector<HTMLElement>('.projects-view')!.hidden).toBe(true);
    expect(root.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe('Horta escola');
    expect(root.querySelector<HTMLInputElement>('[name="goal"]')!.value).toBe('10000');
  });

  it('shows an explicit missing-project state for invalid edit URLs', async () => {
    fixture.destroy();
    route.snapshot.paramMap = convertToParamMap({ id: 'missing' });
    await mount();
    expect(root.querySelector<HTMLElement>('.missing-project')!.hidden).toBe(false);
    expect(root.querySelector<HTMLFormElement>('.editor-form')!.hidden).toBe(true);
  });
});
