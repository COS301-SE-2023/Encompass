import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page.component';
import { ProfileModule } from '@encompass/app/profile/feature'; // Import the ProfileModule

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@encompass/app/feed/feature').then((m) => m.FeedModule),
      },
      {
        path: 'profile',
        pathMatch: 'full',
        loadChildren: () => ProfileModule, // Use the ProfileModule as a lazy-loaded module
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRouting {}
