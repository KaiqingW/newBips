import { Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from 'app/core/services/common.service';
import { AddAttachmentComponent } from './add-attachment/add-attachment.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'opportunity-process-attachment',
  templateUrl: './opportunity-process-attachment.component.html',
  styleUrls: ['./opportunity-process-attachment.component.scss']
})
export class OpportunityProcessAttachmentComponent implements OnInit {

  @Input() title: string;
  @Input() attachments: any;
  // @Input() canUpload: boolean;
  // @Input() currentProcessName: any;
  // @Input() currentProcessId: any;
  
  @Output() sendFormData = new EventEmitter<any>();
  
  selectedAttachment;
  selectedAttachmentIndex: number;
  show;
  attachmentUrl = '';
  modalOpen: boolean = false;
  selectedImg = '';

  category: string = '';


  currentLoginCompanyId;
  
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private commonService: CommonService,
    private route: ActivatedRoute,

    // @Inject(MAT_DIALOG_DATA) public data:any
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    
  }

  ngOnInit() {
   
  }

  ngOnChanges() {
    console.log(this.attachments);
  }



  addAttachementDialog() {
    const dialogRef = this.dialog.open(AddAttachmentComponent, {
      width: '700px',
      data: {
        // currentProcessName: this.currentProcessName,
        // currentProcessId: this.currentProcessId,
        currentLoginCompanyId: this.currentLoginCompanyId,

      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result != null) {
          this.sendFormData.emit(result);
        }
      });
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
      } else if (type.includes('xlsx') || type.includes('xls') || type.includes('xml')) {
        return 'assets/images/icons/excel.png';
      }
    }
    return 'assets/images/icons/unknow.png';
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

  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImg = '';
    this.show = '';
    this.selectedAttachment = '';
  }

  openModal(url) {
    this.selectedImg = url;
    this.modalOpen = true;
  }

  onDownload(selectedAttachment){
      window.open(selectedAttachment.url, '_blank');
  }
}