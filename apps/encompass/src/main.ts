import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app/app.module';
import { CoreModule } from '@encompass/app/core/feature';

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));

platformBrowserDynamic()
  .bootstrapModule(CoreModule)
  .catch((err) => console.error(err));
