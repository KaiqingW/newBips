import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ContactService {
    
    constructor(private http: HttpClient){}

    addCrmContact(contact, company_id, customer_id): Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/contact`, contact);
    }
    
    getCrmContact(company_id, contact_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/contact/${contact_id}`);
    }
    updateContact(contact, company_id, contact_id):Observable<any>{
        return this.http.patch(environment.ORCA_API +`company/${company_id}/contact/${contact_id}`,contact)
    }

    getContactsByCustomerId(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/customer/${customer_id}/contacts`)
    }

    // personal contact 
    addPersonalContact(company_id,value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/personal_contact`, value)
    }

    getPersonalContactList(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/personal_contact`);
    }

    deletePersonalContact(company_id, contact_id): Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/${company_id}/personal_contact/${contact_id}`);
    }

    getPersonalContact(company_id, contact_id): Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/personal_contact/${contact_id}`)
    }

    editPersonalContact(company_id, contact_id, value): Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/personal_contact/${contact_id}`, value);
    }

    //by user id
    getContactbyUserId(company_id, user_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/contact/user/${user_id}`);
    }
}