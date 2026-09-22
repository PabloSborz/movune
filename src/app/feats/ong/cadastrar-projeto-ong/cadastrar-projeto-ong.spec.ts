import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi, afterEach } from 'vitest';
import { CadastrarProjetoOng } from './cadastrar-projeto-ong';
import { AuthStore } from '../../../shared/auth-store.service';
import { SiteActivityStore } from '../../../shared/site-activity.service';

describe('CadastrarProjetoOng', () => {
  let fixture: ComponentFixture<CadastrarProjetoOng>;
  let root: HTMLElement;
  let storage: Map<string, string>;
  beforeEach(async () => {
    storage = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {} }));
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() {} });
    await TestBed.configureTestingModule({ imports: [CadastrarProjetoOng] }).compileComponents();
    TestBed.inject(AuthStore).session.set({ id: 'demo-ong', perfil: 'ong', nome: 'Rede Cuidar', email: 'ong@redecuidar.org', iniciadoEm: '' });
    fixture = TestBed.createComponent(CadastrarProjetoOng);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); vi.useRealTimers(); vi.unstubAllGlobals(); });
  function set(name: string, value: string) { root.querySelector<HTMLInputElement>('[name="' + name + '"]')!.value = value; }
  function click(selector: string) { root.querySelector<HTMLButtonElement>(selector)!.click(); }
  function submit() { root.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true })); }

  it('rejects empty required fields and fractional deadlines', () => {
    submit();
    expect(root.querySelector('#project-name')!.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('#description')!.getAttribute('aria-invalid')).toBe('true');
    set('name', 'Projeto teste'); set('description', 'Descrição'); set('days', '1.5');
    submit();
    expect(root.querySelector('#days')!.getAttribute('aria-invalid')).toBe('true');
    expect(TestBed.inject(SiteActivityStore).byType('projeto')).toHaveLength(0);
  });

  it('adds at most ten editable goals and renumbers after removal', () => {
    for (let i = 0; i < 12; i++) click('.add-objective');
    expect(root.querySelectorAll('.objective')).toHaveLength(10);
    click('.remove-objective');
    expect([...root.querySelectorAll('.objective-number')].map(item => item.textContent)).toEqual(['1','2','3','4','5','6','7','8','9']);
    expect(root.querySelector<HTMLButtonElement>('.add-objective')!.disabled).toBe(false);
  });

  it('saves an incomplete draft with the current owner and redirects', () => {
    vi.useFakeTimers();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    click('.draft-button');
    const record = TestBed.inject(SiteActivityStore).byType('projeto')[0];
    expect(record.status).toBe('Rascunho');
    expect(record.ownerId).toBe('demo-ong');
    expect(storage.get('movune:atividades')).toContain('Rascunho');
    vi.advanceTimersByTime(1200);
    expect(navigate).toHaveBeenCalledWith('/ong/projetos');
  });

  it('persists publication details and prevents repeated submissions', () => {
    set('name', 'Novo projeto'); set('description', 'Impacto na comunidade'); set('goal', '15000'); set('days', '45');
    submit(); submit();
    const records = TestBed.inject(SiteActivityStore).byType('projeto');
    expect(records).toHaveLength(1);
    expect(records[0].status).toBe('Em andamento');
    expect(records[0].fields['Meta financeira']).toBe('15000');
    expect(JSON.parse(records[0].fields['Metas'])).toHaveLength(3);
  });

  it('keeps the form available if local storage fails', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    click('.draft-button');
    expect(root.querySelector('.form-feedback')!.textContent).toContain('Não foi possível salvar');
    expect(root.querySelector<HTMLButtonElement>('.draft-button')!.disabled).toBe(false);
    expect(TestBed.inject(SiteActivityStore).byType('projeto')).toHaveLength(0);
  });

  it('rejects unsupported image types and images larger than 5MB', () => {
    const picker = root.querySelector<HTMLInputElement>('.file-input')!;
    for (const file of [new File(['text'], 'file.txt', { type: 'text/plain' }), new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })]) {
      Object.defineProperty(picker, 'files', { configurable: true, value: [file] });
      picker.dispatchEvent(new Event('change'));
      expect(root.querySelector<HTMLElement>('#upload-error')!.hidden).toBe(false);
      expect(root.querySelector<HTMLImageElement>('.cover-preview')!.hidden).toBe(true);
    }
  });
});
