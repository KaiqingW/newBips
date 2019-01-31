import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyCommonService {
    constructor(private http: HttpClient){

    }

    public searchCompanyContact(company_id, field, query) : Observable<any>{
        return this.http.get(environment.ORCA_API +  `company/${company_id}/search/contacts?t=company_contacts&f=${field}&q=${query}&o=asc`);
    }
}