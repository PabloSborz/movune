import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermosUso } from './termos-uso';

describe('TermosUso', () => {
  let component: TermosUso;
  let fixture: ComponentFixture<TermosUso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermosUso],
    }).compileComponents();

    fixture = TestBed.createComponent(TermosUso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
