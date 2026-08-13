import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilOng } from './perfil-ong';

describe('PerfilOng', () => {
  let component: PerfilOng;
  let fixture: ComponentFixture<PerfilOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilOng],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
