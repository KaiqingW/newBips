import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

export class Lead{ 
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
export class LeadService{
    currentPageCustomerList = [];
    nextpageUrl;
    constructor(private http: HttpClient) { }

    customerFilterByType(company_id, q:string, filename, fieldvalue ):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/filter?type=${q}&fieldname=${filename}&fieldvalue=${fieldvalue}`);
    }

    getCustomerByEmployeeName(company_id, type, employee_name):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search/by_employee_name?type=${type}&&employee_name=${employee_name}`)
    }

    getAdminList(company_id, q: string = 'lead'):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/admin?type=${q}`);
    }
 
    getLeadList(company_id,q: string = 'lead'): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer?type=${q}`)
    }

    getLeadListnext(next): Observable<any> {
        return this.http.get(next);
    }

    getLead(company_id, customer_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/${customer_id}`)
    }

    editLead(company_id, customer_id, customer): Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/customer/${customer_id}`, customer)
    }

    addLead(company_id, company): Observable<any> {
        return this.http.post(environment.ORCA_API + `company/${company_id}/lead`, company)
    }

    convertLead(company_id, lead_id):Observable<any> {
        return this.http.post(environment.ORCA_API + `company/${company_id}/lead/conversion`,{lead_id: lead_id})
    }

    getLeadContacts(company_id, lead_id):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${lead_id}/contact`)
    }

    getLeadAddresses(company_id, lead_id):Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${lead_id}/address`)
    }

    addCustomerAddress(address, company_id, customer_id):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/address`, address)
    }

    editCustomerAddress(address, address_id):Observable<any>{
        return this.http.patch(environment.ORCA_API + `address/${address_id}`, address)
    }

    getAddressById(address_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `address/${address_id}`);
    }

    getVendor(company_id, vendor_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/vendor/${vendor_id}`);
    }

    addCustomerProduct(company_id, customer_id, product_id){
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/product/${product_id}`,{})
    }

    deleteContact(company_id, contact_id):Observable<any>{
        return this.http.delete(environment.ORCA_API + `comany/${company_id}/contact/${contact_id}`);
    }

    changeCustomerPossibility(company_id, customer_id, possibility):Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/possibility`,{possibility: possibility});
    }
    //admin or manager to search customer list
    searchCustomerByFieldName(company_id, type, value, fieldName):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/search/by_fieldname?type=${type}&&searchValue=${value}&&fieldname=${fieldName}`);
    }
    //employee to search customer list
    normalUserSearchCustomerByFiledName(company_id, type, value, fieldName):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/search/by_fieldname_normal?type=${type}&&searchValue=${value}&&fieldname=${fieldName}`);
    }

    markCustomerImportant(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/mark`);
    }

    markCustomerNotImportant(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/not_mark`);
    }

    getPrivateProductsByCustomerId(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/customer/${customer_id}`);
    }

    changeCustomerStatus(company_id, customer_id, status):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/status?type=${status}`);
    }

    changeCustomerEvaluate(company_id, customer_id, evaluate):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/evaluate?type=${evaluate}`);
    }


}