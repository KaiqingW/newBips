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
        public address: string) { }
}

const COMPANIES = [
    new Company(1, 'Orcasmart', 'assets/images/testimg/apple.png', '133 cottage blvd, Hicksville'),
    new Company(2, 'Glopak USA', 'assets/images/testimg/apple.png', '35 Engel Street'),
    new Company(3, 'NYU', 'assets/images/testimg/apple.png', 'New York City'),
];

@Injectable()
export class CompanyService {

    constructor(private http: HttpClient) { }
    
    getCompanies() {
        return Observable.of(COMPANIES);
    }

    public addCompany(name): Observable<any> {
        return this.http.post(environment.ORCA_API + 'company', name);
    }

    public searchCompany(q): Observable<any> {
        return this.http.get(environment.ORCA_API + 'search/company?q=' + q);
    }

    public getCompany(id): Observable<any> {
        return this.http.get(environment.ORCA_API + 'company/' + id);
    }

    public getCompanyAddresses(company_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `address/company/${company_id}`);
    }

    public getCompanyEmployee(companyId): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${companyId}/employee`);
    }

    public getEmployee(companyId, employee_id): Observable<any> {
        return this.http.get(environment.ORCA_API + `company/${companyId}/employee/${employee_id}`);
    }

    public editCompany(company_id, company): Observable<any> {
        return this.http.patch(environment.ORCA_API + 'company/' + company_id, company);
    }

    public addEmployee(companyId, user_id): Observable<any> {
        return this.http.post(environment.ORCA_API + `company/${companyId}/employee`, { user_id: user_id })
    }

    public deleteEmployee(companyId, user_id): Observable<any> {
        return this.http.delete(environment.ORCA_API + `company/${companyId}/employee/${user_id}`)
    }

    public promoteEmployee(companyId, user_id): Observable<any> {
        return this.http.post(environment.ORCA_API + `company/${companyId}/admin`, { user_id: user_id })
    }

    public demoteEmployee(companyId, user_id): Observable<any> {
        return this.http.delete(environment.ORCA_API + `company/${companyId}/admin/${user_id}`)
    }

    public getCompanyCategories(type): Observable<any> {
        return this.http.get(environment.ORCA_API + `category?type=${type}`);
    }

    public searchCompanyCategories(type, value):Observable<any>{
        return this.http.get(environment.ORCA_API + `category/search?type=${type}&value=${value}`);
    }
}