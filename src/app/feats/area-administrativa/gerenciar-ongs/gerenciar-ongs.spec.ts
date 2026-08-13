import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarOngs } from './gerenciar-ongs';

describe('GerenciarOngs', () => {
  let component: GerenciarOngs;
  let fixture: ComponentFixture<GerenciarOngs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarOngs],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarOngs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
