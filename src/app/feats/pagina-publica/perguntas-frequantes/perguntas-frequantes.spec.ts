import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntasFrequantes } from './perguntas-frequantes';

describe('PerguntasFrequantes', () => {
  let component: PerguntasFrequantes;
  let fixture: ComponentFixture<PerguntasFrequantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerguntasFrequantes],
    }).compileComponents();

    fixture = TestBed.createComponent(PerguntasFrequantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
