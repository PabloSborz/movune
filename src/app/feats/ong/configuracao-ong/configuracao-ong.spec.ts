import { TestBed } from '@angular/core/testing';
import { vi, afterEach } from 'vitest';
import { ConfiguracaoOng } from './configuracao-ong';

describe('ConfiguracaoOng', () => {
  afterEach(() => { TestBed.resetTestingModule(); vi.unstubAllGlobals(); });
  it('renders the management page inside the shared ONG shell', async () => {
    const storage = new Map<string,string>();
    vi.stubGlobal('localStorage', { getItem: (key:string) => storage.get(key) ?? null, setItem: (key:string,value:string) => storage.set(key,value), removeItem: (key:string) => storage.delete(key) });
    vi.stubGlobal('matchMedia', () => ({ matches:true, addEventListener() {} }));
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable:true, value() {} });
    await TestBed.configureTestingModule({ imports:[ConfiguracaoOng] }).compileComponents();
    const fixture = TestBed.createComponent(ConfiguracaoOng);
    fixture.detectChanges(); await fixture.whenStable();
    const root:HTMLElement = fixture.nativeElement;
    expect(root.querySelector('.global-header')).toBeTruthy();
    expect(root.querySelector('.page-body')!.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#page-title')!.textContent).toBeTruthy();
    fixture.destroy();
  });
});
