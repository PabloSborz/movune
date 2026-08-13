import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarVoluntarioOng } from './gerenciar-voluntario-ong';

describe('GerenciarVoluntarioOng', () => {
  let component: GerenciarVoluntarioOng;
  let fixture: ComponentFixture<GerenciarVoluntarioOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarVoluntarioOng],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarVoluntarioOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
