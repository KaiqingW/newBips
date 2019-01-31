import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class CostAnalysisService{
    constructor(private http: HttpClient){

    }

    getCostAnalysisList(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/cost_analysis`);
    }

    getCostAnalysis(company_id, cost_analysis_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/cost_analysis/${cost_analysis_id}`);
    }

    addCostAnalysis(company_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/cost_analysis`, value);
    }

    getCostAnalysisCustomizedFiled(company_id: number, model_name: string): Observable<any>{
        return this.http.get(environment.ORCA_API + `setting/company/${company_id}/${model_name}/company_defined_column`)
    }
}