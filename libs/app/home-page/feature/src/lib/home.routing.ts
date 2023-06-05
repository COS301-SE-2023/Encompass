import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'feed',
        // match: 'full',
        loadChildren: () =>
          import('@encompass/app/feed/feature').then((m) => m.FeedModule),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home/feed',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRouting {}
