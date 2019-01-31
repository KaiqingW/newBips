import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class BusinessMeetingService {

  constructor(private http: HttpClient) { }

  // get the subject list posted by current user
  public getSubjectList(company_id, active): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject?active=${active}`);
  }
  
  //get the  next page of subject list posted by current user
  public getSubjectListnext(next): Observable<any> {
    return this.http.get(next);
  }

  // get the total unread of subject list posted by current user
  public getSubjectListUnread(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/totalUnread`);
  }

  // get the total unread of shared subject list posted by current user
  public getSharedSubjectListUnread(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/shared/totalUnread`);
  }

  // get the total unread of created and shared subject list posted by current user
  public getCreatedAndSharedSubjectListUnread(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/created/shared/totalUnread`);
  }

  // get the subject list shared with current user
  public getSharedSubjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/shared`);
  }

  // get the finished subject list shared with current user
  public getFinishedSharedSubjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/shared/finished`);
  }

  //get the  next page of subject list posted by current user
  public getSharedSubjectListnext(next): Observable<any> {
    return this.http.get(next);
  }

  // get the trashed created subject list
  public getTrashedSubjectList(company_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/trashed`);
  }

  // get subject by the subject id
  public getSubject(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}`);
  }

  // get subject by the subject id
  public getBriefSubject(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}/brief`);
  }

  // get subject's shared user list by the subject id
  public getSubjectWithSharedUserList(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}/subject-shared-users`);
  }

  // get subject by the subject id
  public getSubjectSharedUser(company_id, subject_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}/shared_user`);
  }

  // delete subject by the subject id
  public deleteSubject(company_id, subject_id): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}`);
  }

  // delete subject by the subject id
  public finishSubject(company_id, subject_id, finish): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/meeting/finish/subject/${subject_id}`, finish);
  }

  // mark subject by the subject id
  public markSubject(company_id, subject_id, mark): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/meeting/mark/subject/${subject_id}`, mark);
  }

  // mark shared subject by the subject id
  public markSharedSubject(company_id, subject_id, shared_mark): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/meeting/mark/shared/subject/${subject_id}`, shared_mark);
  }

  // delete project by project id
  public editProject(company_id, project_id, project): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}`, project);
  }

  // delete project by project id
  public deleteProject(company_id, project_id): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}`);
  }

  // add new subject
  public addSubject(company_id, subject): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/subject`, subject);
  }

  // edit subject
  public editSubject(company_id, subject_id, subject): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}`, subject);
  }
  

  // add new project
  public addProject(company_id, project): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/project`, project);
  }

  // read a project
  public getProject(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}`);
  }

  // read a project with discussion comments
  public getProjectDiscussion(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}/discussion`);
  }

  // read a project with multiple next meeting subjects list
  public getProjectWithNextSubjectList(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}/nextMeeting`);
  }

  // read a status
  public getStatus(company_id, status_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/status/${status_id}`);
  }

  // read a brief project
  public getBriefProject(company_id, project_id): Observable<any> {
    return this.http.get(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}/brief`);
  }

  // add new status
  public addStatus(company_id, status): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/status`, status);
  }

  // add new reply
  public addReply(company_id, reply): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/reply`, reply);
  }

  public searchCompanyContact(company_id, field, query) : Observable<any>{
    return this.http.get(environment.ORCA_API +  `company/${company_id}/search/contacts?t=company_contacts&f=${field}&q=${query}&o=asc`);
  }

  // share subject to user
  public addSubjectShare(company_id, subject_id, share): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}/share`, share);
  }

  // share subject to user
  public editSharePermission(company_id, subject_id, share): Observable<any> {
    return this.http.patch(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}/share/permission`, share);
  }

  // add owner to a project
  public addProjectAssignOwner(company_id, project_id, assign): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}/assign_owner`, assign);
  }

  // share subject to user and add the user as the project's owner
  public addProjectAssignOwnerAndShare(company_id, project_id, assign): Observable<any> {
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}/share_assign_owner`, assign);
  }
 
  // delete subject unread
  public deleteUnreadSubject(company_id, subjectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/meeting/subject/unread/${subjectId}`);
  }

  public deleteUnreadProject(company_id, projectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/meeting/project/unread/${projectId}`);
  }

  // delete unread status and reply record for project's status
  public deleteUnreadStatus(company_id, projectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/meeting/status/unread/${projectId}`);
  }

  // delete unread comment and reply record for subject's discussion and project's discussion
  public deleteUnreadComment(company_id, projectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `company/${company_id}/meeting/comment/unread/${projectId}`);
  }

  // add attachment for subject
  public addSubjectAttachment(company_id, subject_id, attachment){
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/subject/${subject_id}/attachment`, attachment);
  }

  // add attachment for subject
  public addProjectAttachment(company_id, project_id, attachment){
    return this.http.post(environment.ORCA_API + `company/${company_id}/meeting/project/${project_id}/attachment`, attachment);
  }
  
}
