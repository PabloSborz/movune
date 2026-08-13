import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOngs } from './lista-ongs';

describe('ListaOngs', () => {
  let component: ListaOngs;
  let fixture: ComponentFixture<ListaOngs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaOngs],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaOngs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
