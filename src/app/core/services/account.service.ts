import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

export class Account{ 
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
export class AccountService{
    constructor(private http: HttpClient) { };

    customerFilterByType(company_id, q:string, filename, fieldvalue ):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/filter?type=${q}&fieldname=${filename}&fieldvalue=${fieldvalue}`);
    }

    getCustomerByEmployeeName(company_id, type, employee_name):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search/by_employee_name?type=${type}&&employee_name=${employee_name}`)
    }

    getAdminList(company_id, q: string = 'account'):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/admin?type=${q}`);
    }
    getAccountList(company_id, q :string = 'account'): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer?type=${q}`)
    }
    
    getAccountListnext(next):Observable<any> {
        return this.http.get(next);
    }

    convertToLead(company_id, account_id):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/account/convertLead`,{account_id: account_id});
    }


    getAccount(company_id, customer_id): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/${customer_id}`)
    }

    getAccountContacts(company_id, account_id):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${account_id}/contact`)
    }

    getAccountAddresses(company_id, account_id):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${account_id}/address`)
    }
/********************************below is shared account****************************************** */
    shareCustomer(company_id, customer_id, data):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/shared_user`, {"emails":data})
    }
    destroySharedUser(company_id, customer_id, shared_user_id):Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/shared_user/${shared_user_id}`)
    }

    // getsharedAccount(company_id):Observable<any>{
    //     return this.http.get(environment.ORCA_API + `company/${company_id}/account/shared`)
    // }

    searchCustomerBydescription(company_id, type, description):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/search/by_description?type=${type}&&description=${description}`);
    }

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