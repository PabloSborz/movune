import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasParceiras } from './empresas-parceiras';

describe('EmpresasParceiras', () => {
  let component: EmpresasParceiras;
  let fixture: ComponentFixture<EmpresasParceiras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresasParceiras],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresasParceiras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
