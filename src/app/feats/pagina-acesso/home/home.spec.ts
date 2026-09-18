import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders the volunteer dashboard and its navigation', () => {
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelectorAll('.stat').length).toBe(4);
    expect(page.querySelectorAll('.project').length).toBe(3);
    expect(page.querySelectorAll('.event').length).toBe(2);
    expect(page.querySelectorAll('.job').length).toBe(3);
    expect(page.querySelectorAll('[role="progressbar"]').length).toBe(2);
    expect(page.querySelector('a[href="/doacoes"]')).toBeTruthy();
    expect(page.querySelectorAll('footer').length).toBe(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
