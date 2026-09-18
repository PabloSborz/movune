import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { Favoritos } from './favoritos';

describe('Favoritos', () => {
  let component: Favoritos;
  let fixture: ComponentFixture<Favoritos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favoritos],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Favoritos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows both sections initially and filters by the selected tab', () => {
    expect(fixture.nativeElement.querySelectorAll('.card').length).toBe(4);
    fixture.nativeElement.querySelector('#tab-projetos').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.card').length).toBe(2);
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Projetos Favoritos');
    fixture.nativeElement.querySelector('#tab-vagas').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty').textContent).toContain('Nenhum favorito nesta categoria');
  });

  it('keeps favorites when removal is cancelled and removes them after confirmation', () => {
    vi.useFakeTimers();
    const confirm = vi.spyOn(globalThis, 'confirm').mockReturnValue(false);
    try {
      const cards = component.sections()[0].cards;
      component.remove(cards[0]);
      expect(component.favorites().length).toBe(4);
      confirm.mockReturnValue(true);
      cards.forEach(card => component.remove(card));
      expect(component.removing().length).toBe(2);
      vi.advanceTimersByTime(200);
      fixture.detectChanges();
      expect(component.sections()[0].cards.length).toBe(0);
      expect(fixture.nativeElement.querySelector('.empty').textContent).toContain('Nenhuma ONG favorita ainda');
    } finally {
      confirm.mockRestore();
      vi.useRealTimers();
    }
  });

  it('supports keyboard navigation between tabs', () => {
    const tab = fixture.nativeElement.querySelector('#tab-ongs') as HTMLButtonElement;
    tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(component.activeTab()).toBe('projetos');
    expect(fixture.nativeElement.querySelector('#tab-projetos').getAttribute('aria-selected')).toBe('true');
  });
});
