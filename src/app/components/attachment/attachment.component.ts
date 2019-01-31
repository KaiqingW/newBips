import { Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'app/core/services/common.service';
import { AddAttachmentComponent } from './add-attachment/add-attachment.component';

@Component({
  selector: 'app-attachment',
  templateUrl: 'attachment.component.html',
  styleUrls: ['attachment.component.scss']
})

export class AttachmentComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() attachments: any;
  @Output() sendFormData = new EventEmitter<any>();

  selectedAttachment;
  selectedAttachmentIndex: number;
  show;
  attachmentUrl = '';
  modalOpen: boolean = false;
  selectedImg = '';
  showFolder: boolean = true;
  selectFolderName: string = '';
  category: string = '';
  selectAttachmentArr = [];
  attachmentMap = new Map();
  nonCategoryAttachArr = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService
    // @Inject(MAT_DIALOG_DATA) public data:any
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.attachmentMap = new Map();
    this.sortAttachment();
  }

  showFiles(category) {
    if (category) {
      this.showFolder = false;
    }
    this.category = category;
    this.selectAttachmentArr = [];
    this.selectAttachmentArr = this.attachmentMap.get(category);
    this.selectFolderName = category;
  }

  addAttachementDialog() {
    const dialogRef = this.dialog.open(AddAttachmentComponent, {
      width: '700px',
      data: {
        // company_id: this.company_id,
        // product_id: this.product_id,
        selectFolderName: this.selectFolderName,
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result != null) {
          this.sendFormData.emit(result);
        }
      });
  }

  backToFolder() {
    this.showFolder = true;
    this.selectAttachmentArr = [];
    this.selectFolderName = '';
    this.category = '';
  }

  getIconImg(attachment) {
    if (attachment.description) {
      let type = attachment.description;
      if (type.includes('jpg') || type.includes('jpeg') || type.includes('png' || type.includes('image/'))) {
        return attachment.url;
      } else if (type.includes('pdf')) {
        return 'assets/images/icons/pdf.png';
      } else if (type.includes('word')) {
        return 'assets/images/icons/word.png';
      } else if (type.includes('xml')) {
        return 'assets/images/icons/excel.png';
      }
    }
    return 'assets/images/icons/unknow.png';
  }

  sortAttachment() {
    if (this.attachments && this.attachments.length > 0) {
      let attachments = this.attachments;
      attachments.forEach((attach) => {
        let cate = attach.category;
        if (!this.attachmentMap.has(cate)) {
          this.attachmentMap.set(cate, [attach]);
        } else {
          let arr = this.attachmentMap.get(cate);
          arr.push(attach);
          this.attachmentMap.set(cate, arr);
        }
      })
      this.attachments = Array.from(this.attachmentMap);
      this.nonCategoryAttachArr = this.attachmentMap.get(null);
    }
    if (this.category) {
      this.showFiles(this.category);
    }
  }

  onClickAttachment(attachment, index) {

    this.selectedAttachment = attachment;
    this.selectedAttachmentIndex = index;
    let type = attachment.description;

    if ((!type) || type.includes('image')) {
      this.show = 'image';
      this.openModal(attachment.url);
    } else if (type.includes('pdf')) {
      this.openModal('assets/images/icons/pdf.png');
    } else if (type.includes('word')) {
      this.openModal('assets/images/icons/word.png');
    } else if (type.includes('xml')) {
      this.openModal('assets/images/icons/excel.png');
    } else {
      // this.show = 'image';
      this.attachmentUrl = attachment.url;
      window.open(this.attachmentUrl, '_blank');

    }
    // if( (!attachment.description)|| attachment.description.includes('image')){
    //   this.show = 'image';
    //   this.openModal(attachment.url);
    // } else {
    //   this.show = 'other';
    //   this.attachmentUrl = attachment.url;
    //   window.open(this.attachmentUrl, '_blank');

    // }
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImg = '';
    this.show = '';
    this.selectedAttachment = '';
  }

  openModal(url) {
    console.log(url);
    this.selectedImg = url;
    this.modalOpen = true;
  }

  onDownload(selectedAttachment){
      window.open(selectedAttachment.url, '_blank');
  }
}