import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { RichText } from 'app/core/models/rich_text';

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
  
  subContent: RichText;
  
  // for the image modal after clicking the image
  subjectModalOpen = false;
  selectedAttachment;

  constructor() { 

  }

  ngOnInit() {
  }

  ngOnChanges() {

    this.subContent = JSON.parse(this.content);  

  }

  // close the image modal
  // closeModal(){
  //   this.subjectModalOpen = false;
  // }

  // openSubjectModal(){
  //   this.subjectModalOpen = true;  
  // }

  getIconImg(img) {
    if (img) {
      let type = img;

      if (type.includes('jpg') || type.includes('jpeg') || type.includes('png' || type.includes('image/'))) {
        return img;
      } else if (type.includes('pdf')) {
        return 'assets/images/icons/pdf.png';
      } else if (type.includes('doc')) {
        return 'assets/images/icons/word.png';
      } else if (type.includes('xlsx') || type.includes('xls')) {
        return 'assets/images/icons/excel.png';
      }
    }
    return 'assets/images/icons/unknow.png';
  }

  // onClickAttachment(attachment) {

  //   this.selectedAttachment = attachment;
  //   console.log(this.selectedAttachment);

  //   let selectedAttachmentUrl = attachment.img;

  //   if ((!selectedAttachmentUrl) || selectedAttachmentUrl.includes('image')) {
  //     this.show = 'image';
  //     this.openModal(attachment.img);
  //   } else if (selectedAttachmentUrl.includes('pdf')) {
  //     this.openModal('assets/images/icons/pdf.png');
  //   } else if (selectedAttachmentUrl.includes('doc')) {
  //     this.openModal('assets/images/icons/word.png');
  //   } else if (selectedAttachmentUrl.includes('xlsx')) {
  //     this.openModal('assets/images/icons/excel.png');
  //   } else {
  //     // this.show = 'image';
  //     this.attachmentUrl = attachment.url;
  //     window.open(this.selectedAttachmentUrl, '_blank');

  //   }

  // }

  // openModal(url) {
  //   this.selectedImg = url;
  //   this.modalOpen = true;
  // }

  onDownload(selectedAttachment){
      window.open(selectedAttachment.img, '_blank');
  }
  
}
