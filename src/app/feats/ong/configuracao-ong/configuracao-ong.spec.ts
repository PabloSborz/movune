import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracaoOng } from './configuracao-ong';

describe('ConfiguracaoOng', () => {
  let component: ConfiguracaoOng;
  let fixture: ComponentFixture<ConfiguracaoOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracaoOng],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracaoOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
