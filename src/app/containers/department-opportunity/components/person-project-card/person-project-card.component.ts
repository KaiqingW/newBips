import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'person-project-card',
  templateUrl: './person-project-card.component.html',
  styleUrls: ['./person-project-card.component.scss']
})
export class PersonProjectCardComponent implements OnInit {
  @Input() name;
  @Input() complete;
  @Input() unreadCount;
  @Input() nextMeetingSubject;
  @Input() sales;
  @Input() projectId;
  @Input() superPermission;
  @Input() requireDate;
  @Input() updateFrequency;
  @Input() opportunityValue : number;
  @Input() opportunityValueType;
  
  currentLoginCompanyId;
  nextMeetingSubjectSharedUserList;
  
  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
  }

  ngOnInit() {
    
    if (this.nextMeetingSubject) {
      this.getNextMeetingSubject();
    }

  }

  ngOnChanges() {
   
  }

  getNextMeetingSubject() {
    this.businessMeetingService.getSubject(this.currentLoginCompanyId, this.nextMeetingSubject).subscribe(
      res => {
        this.nextMeetingSubjectSharedUserList = res.sharedWith;
      }
    )
  }

}
