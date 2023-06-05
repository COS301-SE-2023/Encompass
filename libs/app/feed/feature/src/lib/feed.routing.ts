import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedPage } from './feed.component';

const routes: Routes = [
  {
    path: '',
    component: FeedPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRouting {}
