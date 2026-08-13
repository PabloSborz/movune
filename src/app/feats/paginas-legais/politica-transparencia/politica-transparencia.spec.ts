import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaTransparencia } from './politica-transparencia';

describe('PoliticaTransparencia', () => {
  let component: PoliticaTransparencia;
  let fixture: ComponentFixture<PoliticaTransparencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaTransparencia],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaTransparencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
