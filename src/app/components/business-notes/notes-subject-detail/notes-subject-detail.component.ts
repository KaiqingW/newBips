import { Component, OnInit, OnDestroy} from '@angular/core';
import { OrdersService } from 'app/core/services/orders.service';
import { RichText } from 'app/core/models/index';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AddNotesNoteComponent } from 'app/components/business-notes/notes-subject-detail/notes-notes-list/add-notes-note/add-notes-note.component';
import { BusinessNotesService } from 'app/core/services/business-notes.service';
import { CompanyService } from 'app/core/services/company.service';

@Component({
  selector: 'app-notes-subject-detail',
  templateUrl: './notes-subject-detail.component.html',
  styleUrls: ['./notes-subject-detail.component.scss']
})
export class NotesSubjectDetailComponent implements OnInit, OnDestroy {

  currentNote;
  subNotes: RichText;
  modalOpen = false;
  companyId;
  itemId;
  oinId;
  notesSubjectId;
  comments = [];

  vendorName = "";
  vendorId;
  ownCompany;
  private sub : any;

  constructor(private ordersService: OrdersService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private businessNotesService: BusinessNotesService,
    private companyService: CompanyService
  ){
    this.sub = this.route.parent.params.subscribe(params => {
      if (params["vendor_company_id"]) {
        this.vendorId = +params["vendor_company_id"];
      } else {
        this.companyId = + this.route.snapshot.paramMap.get('cid');
      }

      this.companyId = + this.route.snapshot.paramMap.get('cid');
      this.itemId = + this.route.snapshot.paramMap.get('iId');
      this.notesSubjectId = + this.route.snapshot.paramMap.get('nsId');
      this.vendorName = this.route.snapshot.paramMap.get('vendorName');
    });

  }

  ngOnInit(){
    console.log(this.vendorId);
    if (this.vendorId) {
          this.getBusinessNotesSubject(this.vendorId);
          this.ownCompany = false;
    } else {
      this.getBusinessNotesSubject(this.companyId);
      this.ownCompany = true;
    }
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  getBusinessNotesSubject(companyId) {
    this.businessNotesService.getBusinessNotesSubject(companyId, this.notesSubjectId)
      .subscribe(
        (res) => {
          this.currentNote = res;
          this.subNotes = JSON.parse(this.currentNote.description);
          // console.log(typeof this.subNotes, this.subNotes);
          this.comments = this.currentNote.notes;
        }
      )
  }

  closeModal(){
    this.modalOpen = false;
  }

  openModal(note){
    console.log(note);
    this.modalOpen = true;
  }

  addCommentDialog(){
    let companyId;
    if (this.ownCompany) {
      companyId = this.companyId;
    } else {
      companyId = this.vendorId;
    }
    const dialogRef = this.dialog.open(AddNotesNoteComponent, {
      width:'700px',
      data:{
        companyId: companyId,
        itemId: this.itemId,
        oinId : this.oinId,
        notesSubjectId: this.notesSubjectId
      }
    });
    
    const sub = dialogRef.componentInstance.onSendDataToParent.subscribe((data: any) => {
      if (this.ownCompany) {
        this.getBusinessNotesSubject(this.companyId);
      } else {
        this.getBusinessNotesSubject(this.vendorId);
      }
      
    });
  }

  isCurrentUnread(currentNote) {
    console.log(currentNote);
    return currentNote.is_unread;
  }
  isSubUnread(comment) {
    console.log(comment);
    return comment.is_unread;
  }
}
