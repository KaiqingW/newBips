import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class BroadcastService{
    constructor(
        private http:HttpClient
    ){}

    getContactList(company_id, type):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/broadcast?q=${type}`);
    }

    getContactListByPage(url) :Observable<any>{
        return this.http.get(url);
    }

}