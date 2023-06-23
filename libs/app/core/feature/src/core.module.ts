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
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [CoreShell],
})

export class CoreModule {}