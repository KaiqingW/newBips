import { Component, OnInit, Input } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  @Input() name;
  @Input() complete;
  @Input() unreadCount;
  @Input() nextMeetingSubject;
  @Input() owners;
  @Input() projectId;
  @Input() superPermission;
  @Input() requireDate;
  @Input() updateFrequency;
  @Input() attachmentFilesCount: number;
  
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

  getNextMeetingSubject() {
    this.businessMeetingService.getSubject(this.currentLoginCompanyId, this.nextMeetingSubject).subscribe(
      res => {
        this.nextMeetingSubjectSharedUserList = res.sharedWith;
      }
    )
  }
}
