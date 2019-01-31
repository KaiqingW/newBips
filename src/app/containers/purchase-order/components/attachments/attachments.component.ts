import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { OrdersService } from '../../../../core/services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAttachmentComponent } from '../order-status/attachements/add-attachments/add-attachements.component';
import { map } from 'rxjs/operator/map';


@Component({
    selector: 'orders-attchements',
    templateUrl: './attachments.component.html',
    styleUrls: ['./attachments.component.scss']
})


export class OrderAttachemntsComponent implements OnInit, OnChanges {
    attachments;
    company_id: number;
    order_item_id: number;
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
    must_public = 1;
    selectedFolderStatus;
    isLoading = false;

    constructor(private orderService: OrdersService,
        private dialog: MatDialog,
        private route: ActivatedRoute) {
        this.company_id = + this.route.snapshot.paramMap.get('vendor_company_id');
        if (!this.company_id) {
            this.company_id = +this.route.snapshot.paramMap.get('cid');
            this.must_public = 0;
        }
        this.order_item_id = + this.route.snapshot.paramMap.get('iId');
        this.getOrderItemAttachments();
    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

    addAttachementDialog() {
        const dialogRef = this.dialog.open(AddAttachmentComponent, {
            width: '700px',
            data: {
                company_id: this.company_id,
                order_item_id: this.order_item_id,
                selectFolderName: this.selectFolderName,
                edit_mode: this.must_public,
                selectFolderStatus: this.selectedFolderStatus,
            }
        });

        dialogRef.afterClosed().subscribe(
            result => {
                // if (result != null) {
                this.getOrderItemAttachments();
                // }
            });
    }

    getOrderItemAttachments() {
        this.isLoading = true;
        this.orderService.getOrderItemAttachments(this.company_id, this.order_item_id).subscribe(
            (res) => {
                this.isLoading = false;
                this.attachments = res;
                this.sortAttachment();
            }
        )
    }

    sortAttachment() {
        if (this.attachments && this.attachments.length > 0) {
            let attachments = this.attachments;
            this.attachmentMap = new Map();
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

    countUnread(attachments) {
        let count = 0;
        attachments.forEach(element => {
            if (element.unread) {
                count++;
            }
        });
        return count;
    }

    backToFolder() {
        this.showFolder = true;
        this.selectAttachmentArr = [];
        this.selectFolderName = '';
        this.category = '';
        this.selectedFolderStatus = '';
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

    showFiles(category) {
        if (category) {
            this.showFolder = false;
        }
        this.category = category;
        this.selectAttachmentArr = [];
        this.selectAttachmentArr = this.attachmentMap.get(category);
        this.selectFolderName = category;
        this.selectedFolderStatus = this.selectAttachmentArr[0].public;
    }

    onClickAttachment(attachment, index) {
        this.selectedAttachment = attachment;
        this.selectedAttachmentIndex = index;
        let type = attachment.description;
        this.readAttachment(attachment);

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

    onDownload(selectedAttachment) {
        window.open(selectedAttachment.url, '_blank');
    }

    isUnread(attachment) {
        return attachment.unread;
    }

    readAttachment(attachment) {
        let obj = {
            order_item_attachment_id: +attachment.id,
        };
        this.orderService.markUnread(this.company_id, obj).subscribe(
            res => {
                console.log(res);
            }
        )
    }

}
