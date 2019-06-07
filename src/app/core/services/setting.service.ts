import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
// import { attachEmbeddedView } from '@angular/core/src/view';

@Injectable()
export class SettingService {

  constructor(private http: HttpClient) { }

  // get shop departments
  public browseShopDepartments(company_id, query): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department?${query}`);
  }


}
