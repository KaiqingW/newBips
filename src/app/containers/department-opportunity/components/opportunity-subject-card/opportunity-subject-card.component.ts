import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'opportunity-subject-card',
  templateUrl: './opportunity-subject-card.component.html',
  styleUrls: ['./opportunity-subject-card.component.scss']
})
export class OpportunitySubjectCardComponent implements OnInit {

  @Input() name : string;
  @Input() meetingDate : string;
  @Input() meetingTime : string;
  @Input() unreadRecord : number;
  @Input() createdTime : string;
  @Input() url : number;
  @Input() meetingFrequency: string;
  @Input() prevProjectId;

  currentLoginCompanyId;
  // prevProjectId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    // this.prevProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');

  }

  ngOnInit() {
  }

  navigateByUrl(subjectId) {
    
    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/department-opportunity/opportunity-person-project/${this.prevProjectId}/sales-opportunity-subject/${subjectId}`);
    
  }

}
