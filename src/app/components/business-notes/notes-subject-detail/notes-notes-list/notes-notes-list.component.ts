import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'notes-notes-list',
  templateUrl: './notes-notes-list.component.html',
  styleUrls: ['./notes-notes-list.component.scss']
})
export class NotesNotesListComponent implements OnInit {

  @Input() comment;
  body ='';
  modalOpen = false;

  constructor(){}
  
  ngOnInit(){
      this.body = JSON.parse(this.comment.body)[0];
  }

  openModal(){
      this.modalOpen = true;
  }

  closeModal(){
      this.modalOpen = false;
  }

}
