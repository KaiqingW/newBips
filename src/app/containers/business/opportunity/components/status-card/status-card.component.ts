import { Component, OnInit, Input } from '@angular/core';
import { RichText } from 'app/core/models/rich_text';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
@Component({
    selector:'status-card',
    templateUrl:'status-card.component.html',
    styleUrls:['status-card.component.scss']
})

export class StatusCardComponent implements OnInit{
    @Input() createdUser;
    @Input() content;
    // @Input() showReplyStatus;
    // @Input() showReplyComment;  
    @Input() commentId:number;
    @Input() replyPermission;
    // @Input() unreadCount;
    currentLoginCompanyId;
    commentCId;
    
    
    subContent: RichText;
    
    // for the image modal after clicking the image
    // subjectModalOpen = false;
  
    constructor(
        private route: ActivatedRoute,
    ) { 
      this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
      
    }
  
    ngOnInit() {
    }
  
    ngOnChanges() {
      this.subContent = JSON.parse(this.content);  
      this.commentCId = this.commentId;
      console.log(this.currentLoginCompanyId, this.commentCId);
    }
  
    // // close the image modal
    // closeModal(){
    //   this.subjectModalOpen = false;
    // }
  
    // openSubjectModal(){
    //   this.subjectModalOpen = true;  
    // }
  

}