import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AccessProfile, AuthStore } from './auth-store.service';

export const adminGuard: CanActivateFn = (_route, state) => requireProfile('admin', state.url);
export const ongGuard: CanActivateFn = (_route, state) => requireProfile('ong', state.url);
export const userGuard: CanActivateFn = (_route, state) => requireProfile('usuario', state.url);

function requireProfile(profile: AccessProfile, returnUrl: string): boolean | UrlTree {
  const auth = inject(AuthStore);
  const router = inject(Router);
  const session = auth.session();

  if (session?.perfil === profile) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { perfil: profile, retorno: returnUrl },
  });
}
