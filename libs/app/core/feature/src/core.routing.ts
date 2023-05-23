import { NgModule } from '@angular/core';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})

export class CoreRouting{}