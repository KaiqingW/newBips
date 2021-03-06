import { Component, OnInit, Input } from '@angular/core';
import { RichText } from 'app/core/models/rich_text';

@Component({
  selector: 'crm-oppo-subject-content',
  templateUrl: './crm-oppo-subject-content.component.html',
  styleUrls: ['./crm-oppo-subject-content.component.scss']
})
export class CrmOppoSubjectContentComponent implements OnInit {

  @Input() name : string;
  @Input() description : string;
  @Input() createdTime : string;

  subContent: RichText;

  // for the image modal after clicking the image
  subjectModalOpen = false;

  constructor() { }

  ngOnInit() {
    this.subContent = JSON.parse(this.description);
  }

  // close the image modal
  closeModal(){
    this.subjectModalOpen = false;
  }

  openSubjectModal(){
    this.subjectModalOpen = true;  
  }

}
