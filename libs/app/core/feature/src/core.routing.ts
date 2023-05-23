import { NgModule, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/welcome/feature').then((m) => m.WelcomeModule)
  },

  {
    path: 'home',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/home-page/feature').then((m) => m.HomeModule)
  },

  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/login/feature').then((m) => m.LoginModule)
  },

  {
    path: 'profile',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/profile/feature').then((m) => m.ProfileModule)
  },

  {
    path: 'register',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/sign-up/feature').then((m) => m.SignUpModule)
  },
  {
    path: 'sign-up-categories',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/sign-up-interior1/feature').then((m) => m.SignUpInterior1Module)
  },
  {
    path: 'sign-up-communities',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/sign-up-interior2/feature').then((m) => m.SignUpInterior2Module)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})

export class CoreRouting{}