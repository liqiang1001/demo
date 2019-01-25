import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '../cache/cache.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DictService {

  constructor(private cache: CacheService, private http: HttpClient) { }

  get(DICTTYPE) {
    if (!!this.cache.get(DICTTYPE)) {
      return this.cache.get(DICTTYPE);
    } else {
      this.request(DICTTYPE).subscribe(req => {
        this.cache.set(DICTTYPE, req);
        return req;
      });
    }
  }

  request(DICTTYPE) {
    return this.http.get(environment.SERVER_URL + `/usermanagementservice/dictManager/findByType?type=${DICTTYPE}`);
  }


  _get(DICTTYPE) {
    if (!!this.cache.get(DICTTYPE)) {
      return this.cache.get(DICTTYPE);
    } else {
      this._request(DICTTYPE).subscribe((req: any) => {
        this.cache.set(DICTTYPE, req.body);
        return req.body;
      });
    }
  }

  _request(DICTTYPE) {
    return this.http.get(environment.SERVER_URL + `/wechatservice/noAuth/dict/findDictByType?type=${DICTTYPE}`);
  }
}
