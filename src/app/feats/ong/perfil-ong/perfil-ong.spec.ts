import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { PerfilOng } from './perfil-ong';

describe('PerfilOng', () => {
  let fixture: ComponentFixture<PerfilOng>;
  let root: HTMLElement;
  let records: Map<string, string>;
  let storage: { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };

  beforeEach(async () => {
    records = new Map();
    storage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => { records.set(key, value); } };
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    await TestBed.configureTestingModule({ imports: [PerfilOng] }).compileComponents();
    fixture = TestBed.createComponent(PerfilOng);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });
  afterEach(() => { fixture.destroy(); vi.unstubAllGlobals(); });

  function click(selector: string) { root.querySelector<HTMLElement>(selector)!.click(); }

  it('renders the public identity and accurate progress values', () => {
    expect(root.querySelector('h1')!.textContent).toBe('Rede Cuidar');
    expect([...root.querySelectorAll('[role="progressbar"]')].map(bar => bar.getAttribute('aria-valuenow'))).toEqual(['75', '25', '100']);
    expect(root.querySelectorAll('.stat-card').length).toBe(4);
  });

  it('persists following and restores it when the page is opened again', async () => {
    click('.follow-button');
    expect(root.querySelector('.follow-button')!.getAttribute('aria-pressed')).toBe('true');
    expect(records.get('movune:following:rede-cuidar')).toBe('true');
    fixture.destroy();
    fixture = TestBed.createComponent(PerfilOng);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('.follow-button')!.textContent).toBe('Seguindo');
    click('.follow-button');
    expect(records.get('movune:following:rede-cuidar')).toBe('false');
  });

  it('keeps the follow action usable if storage is blocked', () => {
    vi.spyOn(storage, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    click('.follow-button');
    expect(root.querySelector('.follow-button')!.textContent).toBe('Seguindo');
    expect(root.querySelector('.follow-feedback')!.textContent).toContain('Não foi possível salvar');
  });

  it('activates section navigation and reveals the selected supplemental panel', () => {
    click('.profile-tab[href="#equipe"]');
    expect(root.querySelector<HTMLElement>('#equipe')!.hidden).toBe(false);
    expect(root.querySelector('.profile-tab.active')!.textContent).toBe('Equipe');
    click('.profile-tab[href="#transparencia-ong"]');
    expect(root.querySelector<HTMLElement>('#equipe')!.hidden).toBe(true);
    expect(root.querySelector<HTMLElement>('#transparencia-ong')!.hidden).toBe(false);
    click('.profile-tab[href="#sobre"]');
    expect(root.querySelector<HTMLElement>('#transparencia-ong')!.hidden).toBe(true);
  });

  it('closes the mobile menu on Escape', () => {
    click('.menu-toggle');
    expect(root.querySelector('.menu-toggle')!.getAttribute('aria-expanded')).toBe('true');
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(root.querySelector('.menu-toggle')!.getAttribute('aria-expanded')).toBe('false');
  });

  it('provides the requested donation and volunteering destinations', () => {
    expect(root.querySelector('.action-buttons-group a.primary')!.getAttribute('href')).toBe('/doar/rede-cuidar');
    expect(root.querySelector('.action-buttons-group a.outline')!.getAttribute('href')).toBe('/voluntariado/rede-cuidar');
    expect(root.querySelector('.site-link')!.getAttribute('rel')).toContain('noopener');
  });
});
