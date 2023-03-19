import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'aphorisms',
    loadChildren: () =>
      import('./pages/aphorisms/aphorisms.routes').then(
        (m) => m.APHORISMS_ROUTES
      ),
  },
  {
    path: '',
    redirectTo: 'aphorisms',
    pathMatch: 'full',
  },
];
