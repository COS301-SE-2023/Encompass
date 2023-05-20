import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CoreShell } from './core.shell';
import { CoreRouting } from './core.routing';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  declarations: [CoreShell],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    CoreRouting,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [CoreShell],
})

export class CoreModule {}