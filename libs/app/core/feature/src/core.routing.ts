import { NgModule, importProvidersFrom } from '@angular/core';
// import {
//   AuthGuard,
//   redirectLoggedInTo,
//   redirectUnauthorizedTo
// } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// const redirectLoggedOut = () => redirectUnauthorizedTo(['']);
// const redirectLoggedIn = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/welcome/feature').then((m) => m.WelcomeModule)
  },

  {
    path: 'home',
    // pathMatch: 'full',
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@encompass/app/home-page/feature').then((m) => m.HomeModule)
  },

  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/login/feature').then((m) => m.LoginModule)
  },

  // {
  //   path: 'profile',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/profile/feature').then((m) => m.ProfileModule)
  // },

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
  },
  {
    path: 'user-profile',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/user-profile/feature').then((m) => m.UserProfileModule)
  },
  {
    path: 'settings',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/settings/feature').then((m) => m.SettingsModule)
  },
  {
    path: 'themes',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/themes/feature').then((m) => m.ThemesModule)
  },
  // {
  //   path: 'feed',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //   import('@encompass/app/feed/feature').then((m) => m.FeedModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})

export class CoreRouting{}