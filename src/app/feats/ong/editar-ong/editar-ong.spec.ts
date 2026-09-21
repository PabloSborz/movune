import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, vi, Mock } from 'vitest';
import { EditarOng, maskProfileValue } from './editar-ong';
import { AuthStore } from '../../../shared/auth-store.service';

describe('EditarOng', () => {
  let fixture: ComponentFixture<EditarOng>;
  let root: HTMLElement;
  let auth: AuthStore;
  let storage: { getItem: Mock<(key: string) => string | null>; setItem: Mock<(key: string, value: string) => unknown>; removeItem: Mock<(key: string) => unknown> };

  beforeEach(async () => {
    const records = new Map<string, string>();
    storage = {
      getItem: vi.fn((key: string) => records.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => records.set(key, value)),
      removeItem: vi.fn((key: string) => records.delete(key)),
    };
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true, value: function(this: HTMLDialogElement) { this.open = true; },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true, value: function(this: HTMLDialogElement) {
        if (this.open) { this.open = false; this.dispatchEvent(new Event('close')); }
      },
    });
    await TestBed.configureTestingModule({ imports: [EditarOng] }).compileComponents();
    auth = TestBed.inject(AuthStore);
    auth.session.set({ id: 'demo-ong', perfil: 'ong', nome: 'Rede Cuidar', email: 'ong@gmail.com', iniciadoEm: '' });
    fixture = TestBed.createComponent(EditarOng);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => { fixture.destroy(); vi.unstubAllGlobals(); });

  function change(name: string, value: string) {
    const input = root.querySelector<HTMLInputElement>('#' + name)!;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return input;
  }
  function click(selector: string) { root.querySelector<HTMLButtonElement>(selector)!.click(); }
  function submit() { root.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }

  it('formats CNPJ, CEP and both telephone lengths', () => {
    expect(maskProfileValue('cnpj', '12345678000190')).toBe('12.345.678/0001-90');
    expect(maskProfileValue('cep', '01310100')).toBe('01310-100');
    expect(maskProfileValue('telefone', '1132547600')).toBe('(11) 3254-7600');
    expect(maskProfileValue('telefone', '11987654321')).toBe('(11) 98765-4321');
  });

  it('blocks empty required fields with an accessible message', () => {
    change('nomeFantasia', '   ');
    submit();
    expect(root.querySelector('#nomeFantasia-error')!.textContent).toBe('Campo obrigatório');
    expect(root.querySelector('#nomeFantasia')!.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector<HTMLElement>('.toast')!.hidden).toBe(true);
  });

  it('updates the description counter', () => {
    change('descricao', 'Nova descrição');
    expect(root.querySelector('#description-count')!.textContent).toBe('14/500 caracteres');
  });

  it('keeps changes when navigation is declined', async () => {
    change('nomeFantasia', 'Novo nome');
    const leaving = fixture.componentInstance.canLeave();
    expect(root.querySelector<HTMLDialogElement>('.confirmation')!.open).toBe(true);
    click('[data-confirm-no]');
    expect(await leaving).toBe(false);
    expect(root.querySelector<HTMLInputElement>('#nomeFantasia')!.value).toBe('Novo nome');
  });

  it('restores the saved values only after confirming cancellation', async () => {
    change('nomeFantasia', 'Novo nome');
    click('[data-cancel]');
    click('[data-confirm-yes]');
    await Promise.resolve();
    expect(root.querySelector<HTMLInputElement>('#nomeFantasia')!.value).toBe('Rede Cuidar');
    expect(fixture.componentInstance.canLeave()).toBe(true);
  });

  it('persists the profile and reloads it without changing the login email', async () => {
    change('nomeFantasia', 'Rede Atualizada');
    submit();
    expect(root.querySelector('form')!.getAttribute('aria-busy')).toBe('true');
    await vi.waitFor(() => expect(root.querySelector<HTMLElement>('.toast')!.hidden).toBe(false));
    const saved = JSON.parse(storage.getItem('movune:ongs')!).find((ong: { id: string }) => ong.id === 'demo-ong');
    expect(saved.nomeFantasia).toBe('Rede Atualizada');
    expect(saved.contatoEmail).toBe('contato@redecuidar.org');
    expect(saved.email).toBe('ong@gmail.com');
    expect(saved.areasImpacto).toEqual(['Saúde', 'Assistência Social']);
    expect(fixture.componentInstance.canLeave()).toBe(true);
    fixture.destroy();
    fixture = TestBed.createComponent(EditarOng);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector<HTMLInputElement>('#nomeFantasia')!.value).toBe('Rede Atualizada');
  });

  it('reports storage failures without announcing success or losing changes', async () => {
    change('nomeFantasia', 'Não salvo');
    storage.setItem.mockImplementation(() => { throw new Error('Quota exceeded'); });
    submit();
    await vi.waitFor(() => expect(root.querySelector<HTMLElement>('.save-error')!.hidden).toBe(false));
    expect(root.querySelector<HTMLElement>('.toast')!.hidden).toBe(true);
    expect(auth.ongs().find(ong => ong.id === 'demo-ong')!.nomeFantasia).not.toBe('Não salvo');
    const leaving = fixture.componentInstance.canLeave();
    click('[data-confirm-no]');
    expect(await leaving).toBe(false);
  });

  it('asks before removing the logo', async () => {
    click('[data-remove-logo]');
    expect(root.querySelector<HTMLDialogElement>('.confirmation')!.open).toBe(true);
    click('[data-confirm-no]');
    await Promise.resolve();
    expect(fixture.componentInstance.canLeave()).toBe(true);
    click('[data-remove-logo]');
    click('[data-confirm-yes]');
    await Promise.resolve();
    const leaving = fixture.componentInstance.canLeave();
    click('[data-confirm-yes]');
    expect(await leaving).toBe(true);
  });
});
