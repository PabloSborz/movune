import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOng } from './editar-ong';

describe('EditarOng', () => {
  let component: EditarOng;
  let fixture: ComponentFixture<EditarOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarOng],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
