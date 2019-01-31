import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class DepartmentOpportunityService {

  constructor(private http: HttpClient) {    
  }

  // get the subject list posted by current user
  public getSubjectList(company_id, active): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject?active=${active}`);
  }
  
  //get the next page of subject list posted by current user
  public getSubjectListnext(next): Observable<any> {
    return this.http.get(next);
  }

  // get subject by the subject id
  public getSubject(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/${subject_id}`);
  }

  // add new subject
  public addSubject(company_id, subject): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/subject`, subject);
  }

  // get subject by the subject id
  public getDepartmentOpportunitySubject(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/main_subject/${subject_id}`);
  }

  // get the total unread of subject list posted by current user
  public getSubjectListUnread(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/totalUnread`);
  }

  // get the total unread of shared subject list posted by current user
  public getSharedSubjectListUnread(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/shared/totalUnread`);
  }

  // get the total unread of created and shared subject list posted by current user
  public getCreatedAndSharedSubjectListUnread(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/created/shared/totalUnread`);
  }

  // get the subject list shared with current user
  public getSharedSubjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/shared`);
  }

  // get the finished subject list shared with current user
  public getFinishedSharedSubjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/shared/finished`);
  }

  //get the  next page of subject list posted by current user
  public getSharedSubjectListnext(next): Observable<any> {
    return this.http.get(next);
  }

  // get the trashed created subject list
  public getTrashedSubjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/trashed`);
  }

  // add new sales-opportunity project
  public addSalesProject(company_id, project): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/sales_project`, project);
  }

  // add new sales-opportunity project and process work people together
  public addSalesProjectandProcessAdministrator(company_id, project): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/sales_project_process_work_administrator`, project);
  }

  // add new product project opportunity
  public addProductProject(company_id, project): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project`, project);
  }

  // get sales self opportunity project at sales-dashboard
  public getSalesOpportunityProject(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/${subject_id}/sales_opportunity_project`);
  }

  // get sales department opportunity
  public getSalesDepartmentOpportunity(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/sales_department_opportunity`);
  }

  // get sales department opportunity
  public getSalesProjectWithPrevAttachAndNextSubjectList(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/sales_project/${project_id}/next_opportunity_list`);
  }

  // get sales department opportunity
  public getDepartmentOpportunityAttahmentFolders(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/sales_project/${project_id}/department_opportunity_attachment_folders`);
  }

  // get all created project list
  public getCreatedProjectList(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/sales_project/${project_id}/created_projects`);
  }

  // get the total unread of all created project list
  public getCreatedProjectListtotalUnread(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/sales_project/${project_id}/created_projects/totalUnread`);
  }
  
  // get shared project list
  public getSharedProjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/shared_projects`);
  }

  // get project list of the subject by subject id and user
  public browseProjectListBySubjectAndUser(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/subject/${subject_id}/projects_by_user`);
  }

  // get sales self opportunity project at sales-dashboard
  public getDepartmentOpportunitySubjectProcessList(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/main_subject_process/${subject_id}`);
  }

  // add new process for opportunity subject
  public addProcess(company_id, process): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/main_subject_process`, process);
  }

  // add new administrator for the process
  public addProcessAdministrator(company_id, process_id, administrator): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/main_subject_process/${process_id}/administrator`, administrator);
  }

  // remove administrator for the process
  public deleteProcessAdministrator(company_id, process_id, administrator_id): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/department_opportunity/main_subject_process/${process_id}/administrator/${administrator_id}`);
  }

  // get process
  public getProcess(company_id, process_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/opportunity_process/${process_id}`);
  }

  // edit process permission
  public editProcessPermission(company_id, process_id, administrator_id, request): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/department_opportunity/main_subject_process/${process_id}/administrator/${administrator_id}`, request);
  }

  // get product project opportunity with current working process
  public getProductProjectOpportunityWithProcess(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}`);
  }

  // get product project opportunity with detailed information
  public getDetailedProductProjectOpportunity(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/detailed_product_project/${project_id}`);
  }

  // edit process of the product project opportunity, including choosing approvel people of the current process or the work people of nexe process
  public changeProjectProcess(company_id, project_id, request): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/change_project_process`, request);
  }

  // get the current process user list of the project, used for send notify message when the approval people approved or denied the process
  public getProductProjectCurrProcessWorkUsers(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/curr_process_work_users`);
  }

  // edit the current process status of the project, including approved or denied
  public editProjectProcessStatus(company_id, project_id, request): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/change_project_process_status`, request);
  }

  // get status list of the opportunity project by process id
  public getStatusesAndCommentsByProcessId(company_id, project_id, process_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/process/${process_id}`);
  }

  // get attachment files of product project by process id
  public getOpportunityProcessFilesbyProcessId(company_id, project_id, process_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/process/${process_id}/attachment_files`);
  }

  // add attachment for project
  public addProjectAttachment(company_id, project_id, process_id, attachment){
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/process/${process_id}/attachment`, attachment);
  }

  // add opportunity from crm customer
  public addOpportunityWithCrmCustomer(company_id, value):Observable<any>{
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/crm/product_project`,value);
  }

  // edit sku product of the crm opportunity project for sku 
  public updateProjectSKUProduct(company_id, project_id, request): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/department_opportunity/product_project/${project_id}/change_sku_product`, request);
  }

  // add new status
  public addStatus(company_id, status): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/status`, status);
  }

  // add new reply
  public addReply(company_id, reply): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/department_opportunity/reply`, reply);
  }

  // after add-quote, update the completed_opportunity_dollar_amount of the sales project, editted by yali
  public updateProjectOpportunityValue(company_id, request): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/department_opportunity/completed_opportunity_dollar_amount`, request);
  }
  
}
