import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  set(key, value) {
    key = key + '';
    if (Object.prototype.toString.call(value).slice(8, -1) === 'Array' || Object.prototype.toString.call(value).slice(8, -1) === 'Object') {
      const SaveInfo = JSON.stringify(value);
      sessionStorage.setItem(key, SaveInfo);
    } else {
      sessionStorage.setItem(key, value);
    }
  }

  get(key) {
    const info = sessionStorage.getItem(key);
    if (info && (info.indexOf('}') > 0 || info.indexOf(']') > 0)) {
      return JSON.parse(sessionStorage.getItem(key));
    } else {
      return sessionStorage.getItem(key);
    }
  }

  del(key) {
    return sessionStorage.removeItem(key);
  }

  clear() {
    sessionStorage.clear();
  }
}
