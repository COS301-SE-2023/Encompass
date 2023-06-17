import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'feed',
      },
      {
        path: 'feed',
        loadChildren: () =>
          import('@encompass/app/feed/feature').then((m) => m.FeedModule),
      },
      {
        path: 'profile',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/profile/feature').then((m) => m.ProfileModule), 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRouting {}
