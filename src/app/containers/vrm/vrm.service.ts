import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class VrmBaBaService{
    constructor(private http: HttpClient) { }

    customerFilterByType(company_id, q:string, filename, fieldvalue ):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/filter?type=${q}&fieldname=${filename}&fieldvalue=${fieldvalue}`);
    }

    getCustomerInfoByCompanyId(company_id, customer_company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/vrm/customer/company/${customer_company_id}`);
    }

    getCustomerByEmployeeName(company_id, type, employee_name):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/crm_search/by_employee_name?type=${type}&&employee_name=${employee_name}`)
    }

    getAdminList(company_id, q: string):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/crm/customer/admin?type=${q}`);
    }

    getProspectList(company_id, q: string = 'prospect'): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/vrm/customer?type=${q}`);
    }

    getBackupList(company_id, q: string = 'backup'): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/vrm/customer?type=${q}`);
    }

    getMainList(company_id,  q: string = 'main'): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/vrm/customer?type=${q}`);
    }

    getVendorListNext(next): Observable<any> {
        return this.http.get(next);
    }

    getVendor(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/vrm/customer/${customer_id}`);
    }

    convertProspect(company_id, vendor_id):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/prospect/conversion`, {vendor_id:vendor_id})
    }

    convertBackup(company_id, vendor_id):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/backup/conversion`, {vendor_id:vendor_id})
    }

    getVendorContacts(company_id, vendor_id): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${vendor_id}/contact`);
    }

    getVendorAddresses(company_id, vendor_id): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${vendor_id}/address`);
    }

    getproductInterested(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/vrm/customer/${customer_id}/sharing/product_interested`);
    }
    
    searchCustomerByFieldName(company_id, type, value, fieldName):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/search/by_fieldname?type=${type}&&searchValue=${value}&&fieldname=${fieldName}`);
    }

    shareCustomer(company_id, customer_id, data):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/shared_user`, {"emails":data})
    }

    getPrivateProductsByVendorId(company_id, vender_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/inventory/product/vender/${vender_id}`);
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