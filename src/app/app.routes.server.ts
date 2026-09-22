import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ONG sessions live in browser storage, so private routes must resolve there.
  { path: 'ong/**', renderMode: RenderMode.Client },
  { path: 'voluntario/:id/perfil', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
