import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
// import { attachEmbeddedView } from '@angular/core/src/view';

@Injectable()
export class HrService {

  constructor(private http: HttpClient) { }

  // get the product list by your company
  public browseCompanyCategory(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/hr/category`);
  }

  public addCompanyCategory(company_id, category): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/hr/category`, category);
  }

  public editCompanyCategory(company_id, category_id, category): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/hr/category/${category_id}`, category);
  }

  public dropCategory(company_id, category_id): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/hr/category/${category_id}`);
  }
}
