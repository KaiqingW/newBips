import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { orcaMapHeader } from '../models/header';

@Injectable()
export class OpportunityService{
    constructor(private http: HttpClient){}

    //old opportunity api don't use anymore
    getRequestInfoCustomizedFiled(company_id: number, model_name: string): Observable<any>{
        return this.http.get(environment.ORCA_API + `setting/company/${company_id}/${model_name}/company_defined_column`)
    }

    addRequestInfo(company_id,customer_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API +`company/${company_id}/customer/${customer_id}/request_info`, value)
    }

    getRequestInfoList(company_id, customer_id):Observable<any>{
        return this.http.get(environment.ORCA_API+ `company/${company_id}/customer/${customer_id}/request_info`)
    }

    getRequestInfo(company_id, request_info_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/request_info/${request_info_id}`)
    }

    //new Api

//opportunity setting

    getOpportunitySettingList(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunitySetting`);
    }
    getOpportunitySetting(company_id, id):Observable<any>{
        return this.http.get(environment.ORCA_API +`company/${company_id}/opportunitySetting/${id}`);
    }
    addOpportunitySetting(company_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting`, value);
    }
    editOpportunitySetting(company_id, id, value):Observable<any>{
        return this.http.patch(environment.ORCA_API + `company/${company_id}/opportunitySetting/${id}`,value);
    }

    //opportunity setting employee
    getOpportunityEmployeeList(company_id, opportunitySetting_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunitySetting_id}/employee`);
    }
    addOpportunityEmployee(company_id, opportunitySetting_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunitySetting_id}/employee`, value);
    }
    deleteOpportunityEmployee(company_id, opportunitySetting_id, employee_id):Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunitySetting_id}/employee/${employee_id}`);
    }

    // getEmployeeSharedOpportunities(company_id):Observable<any>{
    //     return this.http.get(environment.ORCA_API + `company/${company_id}/`)
    // }


    //opportunity setting attachment 
    opportunitySetingAttachment(company_id, opportunitySetting_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunitySetting_id}/attachment`,value)
    }

    //opportunity setting share 
    getOpportunitySettingSharedUser(company_id, opportunity_setting_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunity_setting_id}/share`);
    }
    addOpportunitySettingSharedUser(company_id, opportunitySetting_id, emailList ):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunitySetting_id}/share`, emailList);
    }

    deleteOpportunitySettingSharedUser(company_id, opportunitySetting_id,user_id):Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunitySetting_id}/share/${user_id}`);
    }

    //opportunity setting status

    getOpportunitySettingStatusList(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/setting/status`);
    }

    addOpportunitySettingSatus(company_id, opportunity_setting_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting/${opportunity_setting_id}/status`, value);
    }

    getOpportunitySettingStatus(company_id, status_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunitySetting/status/${status_id}`);
    }

    addOpportunitySettingComment(company_id, status_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting/status/${status_id}/comment`, value);
    }

    getOpportunitySettingComment(company_id, comment_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunitySetting/comment/${comment_id}`);
    }

    addOpportunitySettingReply(company_id, comment_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunitySetting/comment/${comment_id}/reply`, value);
    }


    // getOpportunitySettingLatestStatus(company_id):Observable<any>{
    //     return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity`);
    // }













//opportunity employee 
    getEmployeeLatestStatus(company_id, opportunity_employee_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunityEmployee/${opportunity_employee_id}/latestStatus`);
    }




















// opportunity
    getOpportunityListByUserId(company_id, user_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/byUser/${user_id}`)
    }
    getOpportunityList(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity`);
    }
    addOpportunity(company_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunity`, value);
    }
    getOpportunity(company_id, opportunity_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/${opportunity_id}`)
    }


    //opportunity attachment
    addOpportunityAttachment(company_id, opportunity_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunity/${opportunity_id}/attachment`, value);
    }


    //opportunity share 
    getOpportunitySharedUserList(company_id, opportunity_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/${opportunity_id}/share`);
    }

    addOpportunitySharedUser(company_id, opportunity_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunity/${opportunity_id}/share`, value);
    }

    deleteOpportunitySharedUser(company_id, opportunity_id, user_id):Observable<any>{
        return this.http.delete(environment.ORCA_API + `company/${company_id}/opportunity/${opportunity_id}/share/${user_id}`);
    }

    //opportunity status
    getStatusDetails(company_id, status_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/status/${status_id}`);
    }
    addOpportunityStatus(company_id, opportunity_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunity/${opportunity_id}/status`, value);
    }

    //opportunity comments
    addOpportunityComment(company_id, status_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunity/status/${status_id}/comment`, value)
    }

    getOpporuntiyComnet(company_id, comment_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/comment/${comment_id}`)
    }

    //opporunity reply
    addOpportunityReply(company_id, comment_id, value):Observable<any>{
        return this.http.post(environment.ORCA_API + `company/${company_id}/opportunity/comment/${comment_id}/reply`, value)
    }

    getAllOpportunies(company_id):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/opportunity/all`);
    }

    getOpportunitiesByFilter(company_id, query):Observable<any>{
        return this.http.get(environment.ORCA_API + `company/${company_id}/filter?type=${query}`);
    }

    
}