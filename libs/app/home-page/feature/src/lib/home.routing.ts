import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home/feed',
  },
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'home/feed',
        // match: 'full',
        loadChildren: () =>
          import('@encompass/app/feed/feature').then((m) => m.FeedModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRouting {}
