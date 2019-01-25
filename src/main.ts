import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LoginView } from './environments/index';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

const a = '/bj/hg/'.replace(/^\/|\/$/g, '');

// const a = sessionStorage.getItem('systemUrl').replace(/^\/|\/$/g, '');
console.log(a);
if (!sessionStorage.getItem('systemconfig')) {
  LoginView.prototype.getSyetem(a);
}

