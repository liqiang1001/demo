// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SERVER_URL: 'http://172.16.234.174:8111/',
  // DEV_URL: 'http://172.16.248.55:9850/',
  BI_IP: 'http://172.16.234.174:8111/',

  NO_AUTH: ['searchSysConfig', 'noAuth', 'token', 'personalCenter/sendMsg']
};
//  * In development mode, for easier debugging, you can ignore zone related error
//  * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
//  * below file. Don't forget to comment it out in production mode
//  * because it will have a performance impact when errors are thrown
//  */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
