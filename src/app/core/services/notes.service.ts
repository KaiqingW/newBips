import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesService {

  constructor(private http: HttpClient) { }

  // get the subject list posted by current user
  public getSubjectList(): Observable<any> {
    return this.http.get(environment.ORCA_API + 'notes/subject');
  }
  
  //get the  next page of subject list posted by current user
  public getSubjectListnext(next): Observable<any> {
    return this.http.get(next);
  }

  // get the subject list shared with current user
  public getSharedSubjectList(): Observable<any> {
    return this.http.get(environment.ORCA_API + 'notes/subject/shared');
  }

  // get subject by the subject id
  public getSubject(subjectId): Observable<any> {
    return this.http.get(environment.ORCA_API + 'notes/subject/' + subjectId);
  }

  // delete subject by the subject id
  public deleteSubject(subjectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'notes/subject/' + subjectId);
  }

  // delete note by note id
  public deleteNote(noteId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'notes/note/' + noteId);
  }

  // add new subject
  public addSubject(subject): Observable<any> {
    return this.http.post(environment.ORCA_API + 'notes/subject', subject);
  }

  // get note by note id
  public getSubjectNote(noteId): Observable<any>{
    return this.http.get(environment.ORCA_API + 'notes/subject/note/' + noteId);
  }

  public addComment(comment): Observable<any> {
    return this.http.post(environment.ORCA_API + 'notes/comment', comment );
  }

 
  public deleteUnreadSubject(subjectId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'subjects/shared/unread/' + subjectId);
  }

  public deleteUnreadNote(noteId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'notes/unread/' + noteId);
  }

  public deleteUnreadComment(noteId): Observable<any> {
    return this.http.delete(environment.ORCA_API + "notes/comments/unread/" + noteId);
  }

  public getComment(commentId): Observable<any> {
    return this.http.get(environment.ORCA_API + 'notes/comment/' + commentId);
  }

  public deleteComment(commentId): Observable<any> {
    return this.http.delete(environment.ORCA_API + 'notes/comment/' + commentId);
  }

  public addNote(note): Observable<any> {
    return this.http.post(environment.ORCA_API + 'notes/note', note);
  }

  // get subject's shared user list
  public getSharedUserList(subjectId): Observable<any> {
    return this.http.get(environment.ORCA_API + `notes/subject/${subjectId}/share`);
  }

  // add new shared user
  public addShare(subjectId, user_id,  type = 'can_view'): Observable<any> {
    return this.http.post(environment.ORCA_API + `notes/subject/${subjectId}/share`, {user_id: user_id, share_type: type});
  }

  // cancel shared user
  public cancelShare(subjectId, userId): Observable<any> {
    const body = {'user_id': userId, share_type: 'can_view'};
    return this.http.request('delete', environment.ORCA_API + `notes/subject/${subjectId}/share`, {body: body});
  }

  // share with new user
  public addNewShare(subjectId, user_email): Observable<any> {
    return this.http.post(environment.ORCA_API + `notes/subject/${subjectId}/share`, {user_email: user_email});
  }

 // search for user
 // not used any more
  //  public getSharedUser(query: string): Observable<any> {
  //   return this.http.get(environment.ORCA_API + `search/user/email?q=${query}`);
  // }

// search for user
public getSpecificUser(query: string, field: string): Observable<any> {
  return this.http.get(environment.ORCA_API + `search/user/specific?q=${query}&f=${field}`);
 }

 public getUserList(q: string = '', sort: string = 'email', order: string = 'desc', page: number = 1): Observable<any> {
  return this.http.get(environment.ORCA_API + `search/user?q=${q}&sort=${sort}&order=${order}&page=1`);
}

  // search for user and get the data
  public getUserEmailList(q: string = '', sort: string = 'email', order: string = 'desc', page: number = 1): Observable<any> {
    return this.http.get(environment.ORCA_API + `search/user?q=${q}&sort=${sort}&order=${order}&page=1`).map(res => res['data']);
  }
}
