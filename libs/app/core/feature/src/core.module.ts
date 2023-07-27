import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CoreShell } from './core.shell';
import { CoreRouting } from './core.routing';
import { RouteReuseStrategy } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import { SignUpModule } from '@encompass/app/sign-up/data-access';
import { LoginModule } from '@encompass/app/login/data-access';
import { ProfileModule } from '@encompass/app/profile/data-access';
import { CreatePostModule } from '@encompass/app/create-post/data-access';
import { HomeModule } from '@encompass/app/home-page/data-access';
import { CreateCommunityModule } from '@encompass/app/create-community/data-access';
import { CommentsModule } from '@encompass/app/comments/data-access';
import { CommunityModule } from '@encompass/app/community-profile/data-access';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { MessagesModule } from '@encompass/app/messages/data-access';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { UserProfileModule } from '@encompass/app/user-profile/data-access';
import { SettingsModule } from '@encompass/app/settings/data-access';
import { ThemesModule } from '@encompass/app/themes/data-access';
import { SignUpCommunitiesModule } from '@encompass/app/sign-up-interior2/data-access';

const config: SocketIoConfig = {
  url: ':3000',
  options: {}
};
@NgModule({
  declarations: [CoreShell],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    CoreRouting,
    NgxsModule.forRoot([]),
    SignUpModule,
    LoginModule,
    ProfileModule,
    HomeModule,
    CreatePostModule,
    CreateCommunityModule,
    CommentsModule,
    CommunityModule,
    MessagesModule,
    UserProfileModule,
    SettingsModule,
    ThemesModule,
    SignUpCommunitiesModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthService, AuthGuard],
  bootstrap: [CoreShell],
})

export class CoreModule {}