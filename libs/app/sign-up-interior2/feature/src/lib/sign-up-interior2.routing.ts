import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpInterior2Component } from './sign-up-interior2.component';

const routes: Routes = [
  {
    path: '',
    component: SignUpInterior2Component,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpInterior2Routing {}
