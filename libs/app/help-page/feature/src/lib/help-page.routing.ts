import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpPagePage } from './help-page.component';

const routes: Routes = [
  {
    path: '',
    component: HelpPagePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpPageRouting {}
