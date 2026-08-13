import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaCookies } from './politica-cookies';

describe('PoliticaCookies', () => {
  let component: PoliticaCookies;
  let fixture: ComponentFixture<PoliticaCookies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaCookies],
    }).compileComponents();

    fixture = TestBed.createComponent(PoliticaCookies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
