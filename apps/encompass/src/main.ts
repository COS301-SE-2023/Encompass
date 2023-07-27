import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app/app.module';
import { CoreModule } from '@encompass/app/core/feature';

// const ENVIRONMENT = process.env['NX_ENVIRONMENT'] || 'development';
// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));

// if (ENVIRONMENT === 'production') {
//   enableProdMode();
// }

platformBrowserDynamic()
  .bootstrapModule(CoreModule)
  .catch((err) => console.error(err));
