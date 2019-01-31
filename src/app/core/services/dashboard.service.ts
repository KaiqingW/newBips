import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable()
export class DashBoardService{
    constructor( private http: HttpClient){}

    getDashBoardData(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/dashboard`);
    }

    getAdminDashBoardData(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/dashboard/admin`);
    }
}