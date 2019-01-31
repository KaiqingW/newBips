import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class Company {
  constructor(public id: number,
              public name: string,
              public logo_url: string,
              public address: string ) { }
}

const COMPANIES = [
    new Company(1, 'Orcasmart', 'assets/images/testimg/purchaseorder.png', '133 cottage blvd, Hicksville'),
    new Company(2, 'Glopak USA', 'assets/images/testimg/pepsi.png', '35 Engel Street'),
    new Company(3, 'NYU', 'assets/images/testimg/business.png', 'New York City'),
];

@Injectable()
export class CompanyService {

    constructor(private http: HttpClient){}
    getCompanies() {
         return Observable.of(COMPANIES);
        }

    public addCompany(name): Observable<any>{
        return this.http.post(environment.ORCA_API + 'company', name);
    }

    public searchCompany(q):Observable<any>{
        return this.http.get(environment.ORCA_API + 'search/company?q=' +q );
    }
    
    public seedCompany(company_id): Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/seed`, company_id);
    }
 
}