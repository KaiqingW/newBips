import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { OrdersService } from '../../../../../core/services/orders.service';

@Component({
    selector: 'order-process-bar',
    templateUrl: './order-process-bar.component.html',
    styleUrls: ['./order-process-bar.component.scss']
})


export class OrderProcessBar implements OnInit, OnChanges {
    @Input() item;
    @Input() company_id: number;
    @Input() status;
    selected_container_infos;
    selected_container_type: number;
    production_schedule_map = new Map();
    production_schedules = [];
    selected_production_schedule;

    constructor(private ordersServie: OrdersService) {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.item) {
            console.log('! item ', this.item);
            this.processProductionSchedule();
        }
    }

    processProductionSchedule() {
        if (!this.item.production_schedule_subjects) {
            return;
        }
        this.item.production_schedule_subjects.forEach(production_subject => {
            let last_production_schedule_in_subject = production_subject.schedules[production_subject.schedules.length - 1];
            this.production_schedules.push(last_production_schedule_in_subject);
            if (!this.production_schedule_map.has(last_production_schedule_in_subject.ifFinish)) {
                let arr = [];
                arr.push(last_production_schedule_in_subject)
                this.production_schedule_map.set(last_production_schedule_in_subject.ifFinish, arr);
            } else {
                this.production_schedule_map.get(last_production_schedule_in_subject.ifFinish).push(last_production_schedule_in_subject);
            }
        });
    }

    getTransform(status) {
        if (status == 0) {
            return 'translateX(0)';
        } else if (status == 7) {
            return 'translateX(-100%)';
        } else {
            return 'translateX(-50%)';
        }
    }

    getRightPosition(status) {
        return status / (this.status.length - 1) * 100 + '%';
    }

    onGetInfos(type, info) {
        if (type > 0) {
            this.readShipping(info);
        } else {
            this.readSchedule(info);
        }
        if (type == this.selected_container_type) {
            this.selected_container_type = 0;
            this.selected_container_infos = null;
            this.selected_production_schedule = null;
        } else if (type > 0) {
            this.selected_container_type = type;
            let res = [];
            this.item.container_infos.forEach(info => {
                if (info.type == type) {
                    res.push(info);
                }
            })
            this.selected_container_infos = res;
        } else if (type == -1 || type == -2) {
            this.selected_container_type = type;
            this.selected_production_schedule = this.production_schedule_map.get(type + 2);
        }
    }
    
    getMapUnread(item) {
        let count = 0;
        item.forEach(element => {
            if (element.is_unread) {
                count++;
            }
        });
        return count;
    }

    getItemUnread(item, type) {
        let count = 0;
        item.forEach(element => {
            if (element.type == type && element.is_unread) {
                count = count + 1;
            }
        });
        return count;
    }

    readShipping(info) {
        info.forEach(element => {
            if (element.is_unread) {
                let obj = {
                    order_item_shipping_id: +element.id,
                };

                this.ordersServie.markUnread(this.company_id, obj).subscribe(
                    res => {
                        console.log(res);
                    }
                );
            }
        });
    }

    readSchedule(info) {
        info.forEach(element => {
            if (element.is_unread) {
                let obj = {
                    production_schedule_id: +element.id,
                }
                this.ordersServie.markUnread(this.company_id, obj).subscribe(
                    res => {
                        console.log(res);
                    }
                )
            }
        });
    }
}