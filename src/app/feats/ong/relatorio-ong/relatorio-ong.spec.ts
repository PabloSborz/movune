import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioOng } from './relatorio-ong';

describe('RelatorioOng', () => {
  let component: RelatorioOng;
  let fixture: ComponentFixture<RelatorioOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioOng],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
