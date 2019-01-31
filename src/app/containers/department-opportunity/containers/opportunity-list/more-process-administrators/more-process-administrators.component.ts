import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Observable } from 'rxjs/Observable';
import { DialogService } from 'app/core/services/dialog.service';
import { CommonService } from 'app/core/services/common.service';
import { FormControl } from '@angular/forms';
import { AuthService } from "app/core/services/auth.service";
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { CompanyService } from 'app/core/services/company.service';
import { ProcessUser } from 'app/core/models/index';

@Component({
  selector: 'more-process-administrators',
  templateUrl: './more-process-administrators.component.html',
  styleUrls: ['./more-process-administrators.component.scss']
})
export class MoreProcessAdministratorsComponent implements OnInit {

  process;
  isLoading;
  processId;
  companyId;

  constructor(
    private departmentOpportunityService: DepartmentOpportunityService,
    private route: ActivatedRoute,
    private router: Router,
    
  ){
    this.processId = +this.route.snapshot.paramMap.get('oppoProcessId');
    this.companyId = +localStorage.getItem("currentLoginCompanyId");   
 
    this.isLoading = true;

  }

  ngOnInit(){
       this.getProcess();
  }

  getProcess() {
    this.departmentOpportunityService.getProcess(this.companyId, this.processId).subscribe(
      res => {
        this.isLoading = false;
        this.process = res;
      }
    )
  }

}