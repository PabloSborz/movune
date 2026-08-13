import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoOng } from './documento-ong';

describe('DocumentoOng', () => {
  let component: DocumentoOng;
  let fixture: ComponentFixture<DocumentoOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentoOng],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentoOng);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
