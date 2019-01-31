import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class CustomerService{
    constructor(private http:HttpClient){ }

    markCustomerImportant(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/mark`);
    }

    markCustomerNotImportant(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/not_mark`);
    }

}