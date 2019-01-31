import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class QuoteSettingService{
    constructor(private http: HttpClient){

    }

    quoteSettingAdd(company_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/quotes_setting`,value);
    }

    quotesSettingGetPayterm(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/quotes_setting/payterm`);
    }

    quotesSettingGetShipVia(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/quotes_setting/shipvia`);
    }

    quotesSettingGetPermission(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/quotes_setting/permission`);
    }

    quoteSettingDelete(company_id,quote_setting_id):Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/${company_id}/quotes_setting/${quote_setting_id}/delete`);
    }

}