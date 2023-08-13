import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpInterior1Component } from './sign-up-interior1.component';

const routes: Routes = [
  {
    path: '',
    component: SignUpInterior1Component,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpInterior1Routing {}
