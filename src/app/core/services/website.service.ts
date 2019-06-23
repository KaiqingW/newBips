import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/core/models/user';
import { ObserveOnMessage } from 'rxjs/operators/observeOn';
import { Subject } from 'rxjs';

@Injectable()
export class WebsiteService {
    rowSubject = new Subject<any>();

    constructor(
        private http: HttpClient
    ) { }

    public getRows(company_id, department_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${company_id}/website/department/${department_id}`);
    }

    public addRow(company_id, department_id, obj): Observable<any> {
        return this.http.post(environment.ORCA_API + `company/${company_id}/website/department/${department_id}/row`, obj);
    }

    public editRow(company_id, department_id, row): Observable<any> {
        return this.http.patch(environment.ORCA_API + `company/${company_id}/website/department/${department_id}/row`, row);
    }
}
