import { Component, OnInit, Input } from '@angular/core';
import { RichText } from 'app/core/models/rich_text';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OpportunityService } from 'app/core/services/opportunity.service';

@Component({
  selector: 'status-content',
  templateUrl: './status-content.component.html',
  styleUrls: ['./status-content.component.scss']
})
export class StatusContentComponent implements OnInit {

  @Input() name : string ;
  @Input() description : string;
  @Input() createdTime : string;
  currentLoginCompanyId;
  opportunity_id;
  isLoading;

  subContent: RichText;

  // for the image modal after clicking the image
  subjectModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private opportunityService : OpportunityService
  ) {
    // this.isLoading = true;;
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.opportunity_id = this.route.snapshot.paramMap.get('oppId');
   }

  ngOnInit() {
    this.subContent = JSON.parse(this.description);
  //  this.getOpportunityName();
  }

  // close the image modal
  closeModal(){
    this.subjectModalOpen = false;
  }

  openSubjectModal(){
    this.subjectModalOpen = true;  
  }

  // getOpportunityName(){
  //   this.opportunityService.getOpportunity(this.currentLoginCompanyId, this.opportunity_id).subscribe(
  //     res=>{
  //       console.log(res);
  //       this.name = res.name;
  //       // this.isLoading = false;
  //     }
  //   )
  // }

}