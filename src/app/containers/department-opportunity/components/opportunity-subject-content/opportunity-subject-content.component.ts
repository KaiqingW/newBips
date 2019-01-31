import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { RichText } from 'app/core/models/rich_text';

@Component({
  selector: 'opportunity-subject-content',
  templateUrl: './opportunity-subject-content.component.html',
  styleUrls: ['./opportunity-subject-content.component.scss']
})
export class OpportunitySubjectContentComponent implements OnInit {

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

  ngOnChanges() {

  }

  // close the image modal
  closeModal(){
    this.subjectModalOpen = false;
  }

  openSubjectModal(){
    this.subjectModalOpen = true;  
  }

}
