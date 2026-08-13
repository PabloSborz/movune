import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarEventosOng } from './gerenciar-eventos-ong';

describe('GerenciarEventosOng', () => {
  let component: GerenciarEventosOng;
  let fixture: ComponentFixture<GerenciarEventosOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarEventosOng],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarEventosOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
