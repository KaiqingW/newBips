import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { OrdersService } from '../../../../core/services/orders.service';
import { Router } from '@angular/router';

@Component({
    selector: 'orders-items-card',
    templateUrl: './items-card.component.html',
    styleUrls: ['./items-card.component.scss']
})

export class OrderItemsCardComponent implements OnInit, OnChanges {
    @Input() items;
    @Input() status;
    @Input() company_id: number;
    @Input() order_id: number;
    @Output() sendNav = new EventEmitter<any>();
    @Output() sendInfos = new EventEmitter<any>();
    @Output() sendOrder = new EventEmitter<any>();
    @Output() sendNavToAttachementOrNote = new EventEmitter<any>();

    constructor(private ordersServie: OrdersService,
        private router: Router) {

    }

    ngOnInit() {
        console.log(this.items);

    }

    ngOnChanges() {
        console.log(this.items);
        if (this.items) {
            this.items.forEach(item => {
                this.getOrderItemStatusInfo(item);
                this.getOrderItemAllShipping(item);
                this.calculateAttachment(item);
                this.calculateNotes(item)
            })
        }
    }

    calculateNotes(item) {
        let notes_subjects_count = 0;
        if (item && item.notes_subjects) {
            let is_vrm_order = this.router.url.includes('/vrm');
            if (item.notes_subjects.length == 0) {
                return;
            }

            item.notes_subjects.forEach(subject => {
                if ((is_vrm_order && subject.public == 1) || (!is_vrm_order)) {
                    notes_subjects_count++;
                }
            })
        }
        item['notes_subjects_count'] = notes_subjects_count;
    }
    
    calculateAttachment(item) {
        if (!item.attachments) {
            return;
        }
        if (this.router.url.includes('vrm')) {
            if (item.attachments.length == 0) {
                item['attachment_count'] = 0;
            } else {
                let count = 0;
                item.attachments.forEach(each => {
                    if (each.name != 'upload_level_up.png' && (each.attachment_status == 1)) {
                        count++;
                    }
                });
                item['attachment_count'] = count;
            }
        } else {
            if (item.attachments.length == 0) {
                item['attachment_count'] = 0;
            } else {
                let count = 0;
                item.attachments.forEach(each => {
                    if (each.name != 'upload_level_up.png') {
                        count++;
                    }
                });
                item['attachment_count'] = count;
            }
        }

    }

    navToItem(item) {
        this.readShipping(item);
        this.sendNav.emit(item);
    }

    readShipping(item){
        let obj = {
            order_item_shipping_id : +item.id,
        }
        this.ordersServie.markUnread(this.company_id, obj).subscribe(
            res => {
                console.log(res);
            }
        )
    }

    getOrderItemStatusInfo(item) {
        if (item.order_id) {
            this.order_id = item.order_id;
        }
        this.ordersServie.getStatusInfo(this.company_id, this.order_id, item.id).subscribe(
            (res) => {
                item['info_item'] = res.info;
            }
        )
    }

    navAttach(attachments) {
        this.sendInfos.emit()
    }

    navNotes() {
        // sendInfos
    }

    sendOrderNum(order_number) {
        this.sendOrder.emit(order_number);
    }

    getOrderItemAllShipping(item) {
        this.ordersServie.getOrderItemALLShipping(this.company_id, item.id).subscribe(
            res => {
                item['container_infos'] = res;
                let count_map = new Map();

                if (item['container_infos'] && item['container_infos'].length > 0) {

                    item['container_infos'].forEach(info => {
                        if (!count_map.has(info.type)) {
                            count_map.set(info.type, 1);
                        } else {
                            count_map.set(info.type, count_map.get(info.type) + 1);
                        }
                    });
                }
                item['count_map'] = count_map;
            }
        )
    }

    navToFolderOrNote(event, type, item) {
        event.stopPropagation();
        this.sendNavToAttachementOrNote.emit({ type, item });
    }
}