import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfiguracaoSistema } from './comfiguracao-sistema';

describe('ComfiguracaoSistema', () => {
  let component: ComfiguracaoSistema;
  let fixture: ComponentFixture<ComfiguracaoSistema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComfiguracaoSistema],
    }).compileComponents();

    fixture = TestBed.createComponent(ComfiguracaoSistema);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
