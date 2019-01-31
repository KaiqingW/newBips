import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

export class Potential{ 
    constructor(
        public id: number,
        public name: string,
        public industry: string,
        public possibility: string,
        public usage: string,
        public logo_url: string
    ){}
}


@Injectable()
export class PotentialService{

    constructor(private http: HttpClient) { }

    customerFilterByType(company_id, q:string, filename, fieldvalue ):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/filter?type=${q}&fieldname=${filename}&fieldvalue=${fieldvalue}`);
    }

    getCustomerByEmployeeName(company_id, type, employee_name):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search/by_employee_name?type=${type}&&employee_name=${employee_name}`)
    }

    getAdminList(company_id, q: string = 'potential'):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/admin?type=${q}`);
    }
 

    getPotentialList(company_id, q:string = 'potential'):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer?type=${q}`)
    }

    getPotentialListNext(next): Observable<any> {
        return this.http.get(next);
    }

    getPotential(company_id, customer_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/${customer_id}`)

    }

    convertPotetnial(company_id, potential_id): Observable<any> {
        return this.http.post(environment.ORCA_API + `company/${company_id}/potential/conversion`, {potential_id: potential_id})
    }

    getPotentialContacts(company_id, potential_id):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${potential_id}/contact`)
    }

    getPotentialAddresses(company_id, potential_id):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${potential_id}/address`)
    }

    //admin or manager to search customer list
    searchCustomerByFieldName(company_id, type, value, fieldName):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/search/by_fieldname?type=${type}&&searchValue=${value}&&fieldname=${fieldName}`);
    }

    //employee to search customer list
    normalUserSearchCustomerByFiledName(company_id, type, value, fieldName):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/search/by_fieldname_normal?type=${type}&&searchValue=${value}&&fieldname=${fieldName}`);
    }

    changeCustomerStatus(company_id, customer_id, status):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/status?type=${status}`);
    }

    changeCustomerEvaluate(company_id, customer_id, evaluate):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/evaluate?type=${evaluate}`);
    }
}