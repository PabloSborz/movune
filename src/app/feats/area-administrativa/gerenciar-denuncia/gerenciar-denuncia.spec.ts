import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarDenuncia } from './gerenciar-denuncia';

describe('GerenciarDenuncia', () => {
  let component: GerenciarDenuncia;
  let fixture: ComponentFixture<GerenciarDenuncia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarDenuncia],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarDenuncia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
