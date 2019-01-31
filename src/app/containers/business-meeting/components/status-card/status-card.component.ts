import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { RichText } from 'app/core/models/rich_text';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';

@Component({
  selector: 'status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent implements OnInit {

  @Input() createdUser;
  @Input() content;
  @Input() showReplyStatus;
  @Input() showReplyComment;  
  @Input() statusId;
  @Input() replyPermission;
  @Input() unreadCount;
  @Input() commentType;
  
  subContent: RichText;
  
  // for the image modal after clicking the image
  subjectModalOpen = false;

  currentLoginCompanyId;
  projectId;
  subjectId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.subjectId = this.route.snapshot.paramMap.get('subjectId');
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.subContent = JSON.parse(this.content);  
  }

  // close the image modal
  closeModal(){
    this.subjectModalOpen = false;
  }

  openSubjectModal(){
    this.subjectModalOpen = true;  
  }

  addCommentReply() {
    // this.router.navigate([`/company/${this.currentLoginCompanyId}/business-meeting/subject/${this.subjectId}/project/${this.projectId}/discussion/add-comment`,{commentType: commentType}])
  
    this.router.navigate([`./comment/${this.statusId}/add-reply`,{commentType: this.commentType}], { relativeTo: this.route } );
    
  }

  addStatusReply() {
    // this.router.navigate([`/company/${this.currentLoginCompanyId}/business-meeting/subject/${this.subjectId}/project/${this.projectId}/discussion/add-comment`,{commentType: commentType}])
  
    this.router.navigate([`./status/${this.statusId}/add-reply`,{commentType: this.commentType}], { relativeTo: this.route } );
    
  }

}
