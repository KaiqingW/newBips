import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class MeetingService {

  constructor(private http: HttpClient) { }

  // get the subject list posted by current user
  public getSubjectList(field, query): Observable<any> {
    return this.http.get(environment.ORCA_API + `meeting/subject?f=${field}&q=${query}`);
  }
  
  //get the  next page of subject list posted by current user
  public getSubjectListnext(next): Observable<any> {
    return this.http.get(next);
  }

  // get the subject list shared with current user
  public getSharedSubjectList(field, query): Observable<any> {
    return this.http.get(environment.ORCA_API + `meeting/subject/shared?f=${field}&q=${query}`);
  }

  // get subject by the subject id
  public getSubject(subjectId): Observable<any> {
    return this.http.get(environment.ORCA_API + 'meeting/subject/' + subjectId);
  }

  // delete subject by the subject id
  public deleteSubject(subjectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'meeting/subject/' + subjectId);
  }

  // delete note by note id
  public deleteNote(noteId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'meeting/note/' + noteId);
  }

  // add new subject
  public addSubject(subject): Observable<any> {
    return this.http.post(environment.ORCA_API + 'meeting/subject', subject);
  }

  // get note by note id
  public getSubjectNote(noteId): Observable<any>{
    return this.http.get(environment.ORCA_API + 'meeting/subject/note/' + noteId);
  }

  public addComment(comment): Observable<any> {
    return this.http.post(environment.ORCA_API + 'meeting/comment', comment );
  }

  public addReply(reply): Observable<any> {
    return this.http.post(environment.ORCA_API + 'meeting/comment/reply', reply );
  }
 
  public deleteUnreadSubject(companyId, subjectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `${companyId}/meeting/subjects/shared/unread/${subjectId}`);
  }

  public deleteUnreadNote(companyId, noteId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `${companyId}/meeting/notes/unread/${noteId}`);
  }

  public deleteUnreadComment(companyId, noteId): Observable<any> {
    return this.http.delete(environment.ORCA_API + `${companyId}/meeting/notes/comments/unread/${noteId}`);
  }

  public getComment(commentId): Observable<any> {
    return this.http.get(environment.ORCA_API + 'meeting/comment/' + commentId);
  }

  public deleteComment(commentId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'meeting/comment/' + commentId);
  }

  public addNote(note): Observable<any> {
    return this.http.post(environment.ORCA_API + 'meeting/note', note);
  }

  // get subject's shared user list
  public getSharedUserList(subjectId): Observable<any> {
    return this.http.get(environment.ORCA_API + `meeting/subject/${subjectId}/share`);
  }

  // add new shared user
  public addShare(subjectId, request): Observable<any> {
    return this.http.post(environment.ORCA_API + `meeting/subject/${subjectId}/share`, request);
  }

  // Edit shared user
  public editShare(subjectId, request): Observable<any> {
    return this.http.patch(environment.ORCA_API + `meeting/subject/${subjectId}/share`, request);
  }

  // cancel shared user
  public cancelShare(subjectId, userId): Observable<any> {
    const body = {'user_id': userId, share_type: 'can_view'};
    return this.http.request('delete', environment.ORCA_API + `meeting/subject/${subjectId}/share`, {body: body});
  }

  // share with new user
  public addNewShare(subjectId, user_email): Observable<any> {
    return this.http.post(environment.ORCA_API + `meeting/subject/${subjectId}/share`, {user_email: user_email});
  }

 // search for user
 public getSpecificUser(query: string, field: string): Observable<any> {
  return this.http.get(environment.ORCA_API + `search/user/specific?q=${query}&f=${field}`);
}

 public getUserList(q: string = '', sort: string = 'email', order: string = 'desc', page: number = 1): Observable<any> {
  return this.http.get(environment.ORCA_API + `search/user?q=${q}&sort=${sort}&order=${order}&page=1`);
}

  // search for user and get the data
  public getUserEmailList(q: string = '', sort: string = 'email', order: string = 'desc', page: number = 1): Observable<any> {
    return this.http.get(environment.ORCA_API + `search/user?q=\"${q}\"&sort=${sort}&order=${order}&page=1`).map(res => res['data']);
  }

  // get subject's shared user list by share_type
  public getSharedUserListByType(subjectId, shareType): Observable<any> {
    return this.http.get(environment.ORCA_API + `meeting/subject/${subjectId}/share_type?q=${shareType}`);
  }

  // add attachment for subject
  public addAttachment(subject_id, attachment){
    return this.http.post(environment.ORCA_API + `meeting/subject/${subject_id}/attachment`, attachment);
  }

  //add attachment for meeting note
  public addMeetingNoteAttachment(meeting_note_id, attachment){
    return this.http.post(environment.ORCA_API + `meeting/note/${meeting_note_id}/attachment`, attachment);
  }

  public addAttachmentTest(attachment){
    return this.http.post(environment.ORCA_API + `uploaded_files`, attachment);
  }

  
}
