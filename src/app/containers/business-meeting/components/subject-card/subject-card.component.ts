import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.scss']
})
export class SubjectCardComponent implements OnInit {

  @Input() name : string;
  @Input() meetingDate : string;
  @Input() meetingTime : string;
  @Input() unreadRecord : number;
  @Input() createdTime : string;
  @Input() url : number;
  @Input() meetingFrequency: string;
  @Input() attachmentFilesCount : number;
  
  currentLoginCompanyId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    
  }

  ngOnInit() {
  }

  navigateByUrl(subjectId) {
    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/business-meeting/subject/${subjectId}`);
    
  }

}
