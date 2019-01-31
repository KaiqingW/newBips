import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'opportunity-step-setting',
  templateUrl: './opportunity-step-setting.component.html',
  styleUrls: ['./opportunity-step-setting.component.scss']
})
export class OpportunityStepSettingComponent implements OnInit {

  currentLoginCompanyId;
  subject_id;
  departmentOpportunitySubject;
  isLoading;

  // max num of share
  maxApproval: number = 7;
  maxWork = [];

  constructor(
    private departmentOpportunityService: DepartmentOpportunityService,
    private route: ActivatedRoute,
    private router: Router,
    
  ){
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.subject_id = this.route.snapshot.paramMap.get('oppoSubjectId');
    this.isLoading = true;

  }

  ngOnInit(){
    this.getDepartmentOpportunitySubjectProcessList();
  }

  getDepartmentOpportunitySubjectProcessList() {
    this.departmentOpportunityService.getDepartmentOpportunitySubjectProcessList(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {
        this.isLoading = false;        
        this.departmentOpportunitySubject = res;
        
        for (let i=0; i<this.departmentOpportunitySubject.opportunity_processes.length; i++) {
          this.maxWork[i] = (this.maxApproval - this.departmentOpportunitySubject.opportunity_processes[i].process_approvals.length > 0) ? this.maxApproval - this.departmentOpportunitySubject.opportunity_processes[i].process_approvals.length : 0;
          
        }
      }
    )
  }
    

}