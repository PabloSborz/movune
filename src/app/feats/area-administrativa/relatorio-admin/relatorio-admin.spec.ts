import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioAdmin } from './relatorio-admin';

describe('RelatorioAdmin', () => {
  let component: RelatorioAdmin;
  let fixture: ComponentFixture<RelatorioAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
