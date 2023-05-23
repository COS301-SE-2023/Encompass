import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@encompass/app/home-page/feature').then((m) => m.HomeModule),
  }
];
