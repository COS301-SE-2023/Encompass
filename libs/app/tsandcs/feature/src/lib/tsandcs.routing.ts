import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TsandcsPage } from './tsandcs.component';

const routes: Routes = [
  {
    path: '',
    component: TsandcsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TsandcsRouting {}
