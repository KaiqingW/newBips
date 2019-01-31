import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class CrmAssignmentService{
    constructor(private http: HttpClient){

    }
    getCustomerList(company_id, type:string ):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crmcustomer/assignment?q=${type}`);
    }

    getCustomerListByPage(url):Observable<any>{
        return this.http.get(url);
    }

    assignToUser(company_id, user_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/crmcustomer/assignment/${user_id}`, value);
    }

    deleteAssignAt(company_id, customer_id):Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/assign_at`, null);
    }

}