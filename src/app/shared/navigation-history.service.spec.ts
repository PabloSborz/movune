import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { NavigationHistoryService } from './navigation-history.service';

describe('NavigationHistoryService', () => {
  it('returns to the home page when there is no previous route in the app', () => {
    const back = vi.fn();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Location, useValue: { back } }],
    });

    const router = TestBed.inject(Router);
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const history = TestBed.inject(NavigationHistoryService);

    history.back();

    expect(back).not.toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });
});
