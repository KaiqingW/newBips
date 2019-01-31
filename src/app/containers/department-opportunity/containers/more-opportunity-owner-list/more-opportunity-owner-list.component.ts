import { Component, OnInit } from '@angular/core';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'more-opportunity-owner-list',
  templateUrl: './more-opportunity-owner-list.component.html',
  styleUrls: ['./more-opportunity-owner-list.component.scss']
})
export class MoreOpportunityOwnerListComponent implements OnInit {

  project;
  projectId;
  currentLoginCompanyId;
  isLoading;
  
  constructor(
    private departmentOpportunityService: DepartmentOpportunityService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('oppoProjectId');
    this.isLoading = true;
  }

  ngOnInit() {
    this.getProductProject();
  }

  getProductProject() {
    this.departmentOpportunityService.getProductProjectOpportunityWithProcess(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;
      }
    )
  }

}
