import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    pathMatch: 'full',
    loadChildren: () =>
      import('@encompass/app/home-page/feature').then((m) => m.HomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})

export class CoreRouting{}