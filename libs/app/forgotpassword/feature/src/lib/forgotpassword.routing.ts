import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordPage } from './forgotpassword.component';

const routes: Routes = [
  {
    path: '',
    component: ForgotpasswordPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotpasswordRouting {}
