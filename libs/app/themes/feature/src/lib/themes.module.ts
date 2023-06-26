import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemesPage } from './themes.component';
import { ThemesRouting } from './themes.routing';
// import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [CommonModule, IonicModule, ThemesRouting, ],
  declarations: [ThemesPage],
  providers: [],
})
export class ThemesModule {}