import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaDoacaoOng } from './gerencia-doacao-ong';

describe('GerenciaDoacaoOng', () => {
  let component: GerenciaDoacaoOng;
  let fixture: ComponentFixture<GerenciaDoacaoOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaDoacaoOng],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciaDoacaoOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
