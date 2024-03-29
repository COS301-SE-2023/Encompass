import { NgModule, importProvidersFrom } from '@angular/core';
// import {
//   AuthGuard,
//   redirectLoggedInTo,
//   redirectUnauthorizedTo
// } from '@angular/fire/auth-guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UnauthGuard } from './unauth.guard';

// const redirectLoggedOut = () => redirectUnauthorizedTo(['']);
// const redirectLoggedIn = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [UnauthGuard],
    loadChildren: () =>
      import('@encompass/app/welcome/feature').then((m) => m.WelcomeModule)
  },

  // {
  //   path: 'welcome',
  //   // pathMatch: 'full',
  //   // data: { authGuardPipe: redirectLoggedOut },
  //   loadChildren: () =>
  //   import('@encompass/app/welcome/feature').then((m) => m.WelcomeModule)
  // },

  {
    path: 'home',
    // pathMatch: 'full',
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@encompass/app/home-page/feature').then((m) => m.HomeModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'login',
    pathMatch: 'full',
    canActivate: [UnauthGuard],
    loadChildren: () =>
      import('@encompass/app/login/feature').then((m) => m.LoginModule)
  },
  // {
  //   path: 'comments',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/comments/feature').then((m) => m.CommentsModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'privacy',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/privacy/feature').then((m) => m.PrivacyModule)
  },
  {
    path: 'team',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/team/feature').then((m) => m.TeamModule)
  },
  {
    path: 'tscs',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/tsandcs/feature').then((m) => m.TsandcsModule)
  },
  {
    path: 'forgotpassword',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/forgotpassword/feature').then((m) => m.ForgotpasswordModule)
  },

  // {
  //   path: 'profile',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/profile/feature').then((m) => m.ProfileModule),
  //   canActivate: [AuthGuard]
  // },

  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [UnauthGuard],
    loadChildren: () =>
      import('@encompass/app/sign-up/feature').then((m) => m.SignUpModule)
  },
  {
    path: 'sign-up-categories',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/sign-up-interior1/feature').then((m) => m.SignUpInterior1Module),
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-up-communities',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@encompass/app/sign-up-interior2/feature').then((m) => m.SignUpInterior2Module)
  },
  // {
  //   path: 'user-profile/:username',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/user-profile/feature').then((m) => m.UserProfileModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'app-comments-feature/:id',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/comments/feature').then((m) => m.CommentsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'settings',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/settings/feature').then((m) => m.SettingsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'themes',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/themes/feature').then((m) => m.ThemesModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'welcome',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/welcome/feature').then((m) => m.WelcomeModule)
  // },
  // {
  //     path: 'challenge-description',
  //     pathMatch: 'full',
  //     loadChildren: () =>
  //       import('@encompass/app/challenge-description/feature').then((m) => m.ChallengeDescriptionModule),
  //     //canActivate: [AuthGuard]
  //   },
  // {
  //   path: 'community-profile/:name',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/community-profile/feature').then((m) => m.CommunityProfileModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'search-explore',
  //   pathMatch: 'full',
  //   loadChildren: () =>
  //     import('@encompass/app/search-explore/feature').then((m) => m.SearchExploreModule),
  //   canActivate: [AuthGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})

export class CoreRouting{}