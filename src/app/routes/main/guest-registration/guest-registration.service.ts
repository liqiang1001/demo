import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GuestRegistrationService {

  constructor(private http: HttpClient) { }
  // 提交上访记录
  submitPetition(params) {
    return this.http.post(environment.SERVER_URL + `/work-record-service/complainerVisitor/addVisitor`, params
    );
  }
}
