import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddProductionSubjectComponent } from '../add-production-subject/add-production-subject.component';
import { ConfirmProductionDateComponent } from '../confirm-production-date/confirm-production-date.component';
import { OrdersService } from '../../../../../../core/services/orders.service';

@Component({
    selector: 'production-schedule',
    templateUrl: './production-schedule.component.html',
    styleUrls: ['../../order-status.component.scss', './production-schedule.component.scss']
})

export class ProductionScheduleComponent implements OnInit, OnChanges {
    @Input() ownCompany;
    @Input() schedules;
    @Input() companyId;
    @Input() itemId;
    @Input() item;
    @Output() sendOutput = new EventEmitter<any>();
    constructor(
        private dialog: MatDialog,
        private orderService: OrdersService,
    ) { }

    ngOnInit() {

    }

    ngOnChanges() {
        console.log(this.schedules);
    }

    addEstProdDateDialog(i, j) {
        const dialogRef = this.dialog.open(AddProductionSubjectComponent, {
            width: '700px',
            data: {
                company_id: this.companyId,
                order_item_id: this.itemId,
                quantity: this.item.quantity,
                schedules: this.schedules
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.sendOutput.emit(true);
            }
        });
    }

    confirmProdDateDialog(i, j, scheduleItem) {
        console.log(scheduleItem);
        const dialogRef = this.dialog.open(ConfirmProductionDateComponent, {
            width: '700px',
            data: {
                company_id: this.companyId,
                order_item_id: this.itemId,
                quantity: this.item.quantity,
                index: i,
                innerIndex: j,
                schedules: this.schedules,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.sendOutput.emit(true);
            }
        });
        this.readShipping(scheduleItem);
    }
    readShipping(scheduleItem) {
        let obj = {
            production_schedule_id: +scheduleItem.id,
        };
        this.orderService.markUnread(this.companyId, obj).subscribe(
            res => {
                console.log(res);
            }
        )
    }
}