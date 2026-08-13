import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificado } from './certificado';

describe('Certificado', () => {
  let component: Certificado;
  let fixture: ComponentFixture<Certificado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Certificado],
    }).compileComponents();

    fixture = TestBed.createComponent(Certificado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
