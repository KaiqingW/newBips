import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Order_Item, Order } from "../models/index";
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class BusinessNotesService {
  token: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  
  currentNote;

  public getBusinessNotesSubjectList(companyId, modelName, modelNameId) {
    return this.http.get(environment.ORCA_API + `company/${companyId}/${modelName}/${modelNameId}/notes_subject`);
  }

  public getBusinessNotesSubject(companyId, notes_subject_id) {
    return this.http.get(environment.ORCA_API + `company/${companyId}/notes_subject/${notes_subject_id}`);
  }

  public getBusinessNotesNoteList(companyId, notes_subject_id) {
    return this.http.get(environment.ORCA_API + `company/${companyId}/notes_subject/${notes_subject_id}/notes_note`);
  }

  public addBusinessNotesSubject(companyId, modelName, modelNameId, noteSubject){
    return this.http.post(environment.ORCA_API + `company/${companyId}/${modelName}/${modelNameId}/notes_subject`, noteSubject);
  }

  public addBusinessNotesNote(companyId, oinId , notesNote){
    return this.http.post( environment.ORCA_API + `company/${companyId}/notes_subject/${oinId}/notes_note`, notesNote);
  }

  // public addBusinessNotesComment(companyId, notesNoteId , notesComment){
  //   return this.http.post( environment.ORCA_API + `company/${companyId}/notes_note/${notesNoteId}/notes_comment`, notesComment);
  // }

  public getSelectedNote(){
    return this.currentNote;
  }

  public setNote(note){
    this.currentNote = note;
  }
}
