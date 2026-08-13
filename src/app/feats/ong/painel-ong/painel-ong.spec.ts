import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelOng } from './painel-ong';

describe('PainelOng', () => {
  let component: PainelOng;
  let fixture: ComponentFixture<PainelOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelOng],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
