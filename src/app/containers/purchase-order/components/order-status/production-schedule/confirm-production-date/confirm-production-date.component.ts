import { Component, OnInit, Inject } from '@angular/core';
import { OrdersService } from 'app/core/services/orders.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Production_Schedule } from 'app/core/models/index';

@Component({
    selector: 'app-confirm-production-date',
    templateUrl: './confirm-production-date.component.html',
    styleUrls: ['./confirm-production-date.component.scss']
})


export class ConfirmProductionDateComponent implements OnInit {
    quantity: number;
    company_id: number;
    order_item_id: number;
    prodDates: string;
    confirmProdDateCallBack;
    schedules = [];
    canConfirm = false;
    lastIndex: number;
    schedule: Production_Schedule = new Production_Schedule(false, '', '', 0, 0, '', null);
    selectedIndex: number;
    statusForm: FormGroup;
    index: number;
    choose;
    status: number;
    finalSchedule;
    constructor(private ordersService: OrdersService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ConfirmProductionDateComponent>,
    ) {

        this.company_id = + this.data.company_id;
        this.order_item_id = + this.data.order_item_id;
        this.quantity = +this.data.quantity;
        this.schedules = this.data.schedules;
        this.selectedIndex = this.data.innerIndex;
        this.index = this.data.index;
        this.lastIndex = this.schedules[this.index].schedules.length - 1;
        this.schedule = this.schedules[this.index].schedules[this.selectedIndex];
        this.createStatusForm();
    }

    ngOnInit() {

    }

    createStatusForm() {
        this.statusForm = this.fb.group({
            ets_time: [''],
            etf_time: [''],
            status: [''],
            comment: [''],
            ifFinish: [false],
            prod_rate: [this.schedules[this.index].schedules[this.selectedIndex].prod_rate],
            production_qty: [this.schedules[this.index].schedules[this.selectedIndex].production_qty],
        })
    }

    toAddBatchNumMode() {
        //    this.addBatchMode = true;
    }

    updateSchedule() {
        let tempSchedule = JSON.parse(JSON.stringify(this.schedule));
        tempSchedule.comment = this.statusForm.value.comment;
        tempSchedule.ets_time = this.statusForm.value.ets_time;
        tempSchedule.etf_time = this.setEtfDate(tempSchedule);

        if (this.choose == 'change_date') {

            console.log('form date ', this.statusForm.value.ets_time);
            tempSchedule.ifFinish = false;
            // this.schedules[this.index].push(tempSchedule);
            this.statusForm.patchValue({
                ets_time: tempSchedule.ets_time,
                etf_time: tempSchedule.etf_time,
                status: 1
            });
            this.status = 1;
        } else if (this.choose == 'actual_date') {
            this.schedule.ifFinish = true;
            this.statusForm.patchValue({
                etf_time: tempSchedule.etf_time,
                ifFinish: true,
                status: 2
            })
        }

        return true;
    }

    setEtfDate(tempSchedule) {
        let days = Math.ceil(tempSchedule.production_qty / tempSchedule.prod_rate);
        let startDate = new Date(tempSchedule.ets_time);
        let newdays = new Date(startDate.getTime() + days * 1000 * 60 * 60 * 24);

        let month = this.prepend_0_to_date(newdays.getMonth() + 1);
        let date = this.prepend_0_to_date(newdays.getDate());
        let etf_time_final = newdays.getFullYear() + '-' + month + '-' + date;

        return etf_time_final;
    }

    prepend_0_to_date(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    changeDateFormate(date) {
        let res = '';
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let secs = date.getSeconds();
        res = this.prepend_0_to_date(month) + '/' +
            this.prepend_0_to_date(day) +
            '/' + year + ' at ' +
            this.prepend_0_to_date(hours) + ':' +
            this.prepend_0_to_date(minutes) + ':' +
            this.prepend_0_to_date(secs);

        return res;
    }

    onSave() {
        if (this.updateSchedule()) {
            if (!this.choose || this.statusForm.valid) {
                // let data = {
                //     est_production_date: JSON.stringify(this.schedules),
                //     status: this.status
                // };
                // this.ordersService.updateOrderItem(this.company_id, this.order_item_id, data).subscribe(
                //     (res) => {
                //         this.confirmProdDateCallBack = res;
                //     }
                // )
                let production_subject_id = this.schedules[this.index].schedules[this.selectedIndex].production_schedule_subject_id;
                console.log(production_subject_id, this.statusForm.value);
                this.ordersService.addProdcutionSchedule(this.company_id, production_subject_id, this.statusForm.value).subscribe(
                    (res) => {
                        this.dialogRef.close(res);
                    },
                    (err) => {

                    }
                )
            }

        }
    }
}

