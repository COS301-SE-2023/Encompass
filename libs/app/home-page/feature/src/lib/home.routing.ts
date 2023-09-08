import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home-page.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'feed',
      },
      {
        path: 'feed',
        loadChildren: () =>
          import('@encompass/app/feed/feature').then((m) => m.FeedModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/profile/feature').then((m) => m.ProfileModule),
        canActivate: [AuthGuard] 
      },
      {
        path: 'themes',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/themes/feature').then((m) => m.ThemesModule), 
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/settings/feature').then((m) => m.SettingsModule), 
        canActivate: [AuthGuard]
      },
      {
        path: 'community-profile',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/community-profile/feature').then((m) => m.CommunityProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'messages',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/messages/feature').then((m) => m.MessagesModule), 
        canActivate: [AuthGuard]
      },
      {
        path: 'user-profile',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/user-profile/feature').then((m) => m.UserProfileModule), 
        canActivate: [AuthGuard]
      },
      {
        path: 'search-explore',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/search-explore/feature').then((m) => m.SearchExploreModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'app-comments-feature/:id',
        pathMatch: 'full',
        loadChildren: () =>
          import('@encompass/app/comments/feature').then((m) => m.CommentsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-profile/:username',
        pathMatch: 'full',
        loadChildren: () =>
          import('@encompass/app/user-profile/feature').then((m) => m.UserProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'community-profile/:name',
        pathMatch: 'full',
        loadChildren: () =>
          import('@encompass/app/community-profile/feature').then((m) => m.CommunityProfileModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'event',
        // pathMatch: 'full',
        loadChildren: () => import('@encompass/app/event/feature').then((m) => m.EventModule), 
        canActivate: [AuthGuard]
      },
      {
        path: 'challenge-description',
        pathMatch: 'full',
        loadChildren: () => 
          import('@encompass/app/challenge-description/feature').then((m) => m.ChallengeDescriptionModule), 
        canActivate: [AuthGuard]
      },

      {
        path: 'quiz/:id',
        pathMatch: 'full',
        loadChildren: () => 
          import('@encompass/app/quiz/feature').then((m) => m.QuizModule), 
        canActivate: [AuthGuard]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRouting {}
