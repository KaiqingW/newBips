import { Component, OnInit, Input } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'crm-project-card',
  templateUrl: './crm-project-card.component.html',
  styleUrls: ['./crm-project-card.component.scss']
})
export class CrmProjectCardComponent implements OnInit {

  @Input() name;
  @Input() productItemNumber;
  
  @Input() complete;
  @Input() unreadCount;
  @Input() nextMeetingSubject;
  @Input() owners;
  @Input() projectId;
  @Input() superPermission;
  @Input() requireDate;
  @Input() updateFrequency;
  @Input() currentProcessId;
  @Input() currentProcessStatus;
  @Input() subjectId;
  @Input() productImageUrl;
  @Input() prevSalesProjectId;

  currentLoginCompanyId;
  nextMeetingSubjectSharedUserList;
  departmentOpportunityId;
  processList;
  maxOwner: number = 8;
  completedProcessIndex;
  prevProcessList = [];
  nextProcessList = [];
  currentProcess;
  
  selectedImg;
  modalOpen;

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private departmentOpportunityService: DepartmentOpportunityService,
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    // this.prevSalesProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');    
    
  }

  ngOnInit() {

    this.getOpportunityProcessList();
    // if (this.nextMeetingSubject) {
    //   this.getNextMeetingSubject();
    // }
    
  }

  getOpportunityProcessList() {
    // first get the sales_department_opportunity id 
    this.departmentOpportunityService.getSalesDepartmentOpportunity(this.currentLoginCompanyId).subscribe(
      res => {
        this.departmentOpportunityId = res.id;

        // then get the process list of the department opportunity
        this.departmentOpportunityService.getDepartmentOpportunitySubjectProcessList(this.currentLoginCompanyId, this.departmentOpportunityId).subscribe(
          res => {
            this.processList = res.opportunity_processes;
        
            // check the current process index of process list
            // for the previous process before the current process and the current process, click and jump to the process
            // for after the current process, cannot click
            for (let i=0; i<this.processList.length; i++) {
              if (this.processList[i].id == this.currentProcessId) {
                this.completedProcessIndex = i;
                break;
              }
            }

            for (let i=0; i<this.processList.length; i++) {
              if (i < this.completedProcessIndex) {
                this.prevProcessList.push(this.processList[i]);
              } else if (i == this.completedProcessIndex) {
                this.currentProcess = this.processList[i];
              } else if (i > this.completedProcessIndex) {
                this.nextProcessList.push(this.processList[i]);
              }
            }
            
          }
        )
      }
    )
  }

  // not show the shared user of next meeting
  // getNextMeetingSubject() {
  //   this.businessMeetingService.getSubject(this.currentLoginCompanyId, this.nextMeetingSubject).subscribe(
  //     res => {
  //       this.nextMeetingSubjectSharedUserList = res.sharedWith;
  //     }
  //   )
  // }

  openModal(url) {
    if (!url) return;
    this.selectedImg = url;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImg = '';
    
  }

}
