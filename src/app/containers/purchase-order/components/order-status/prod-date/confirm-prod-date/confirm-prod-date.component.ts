import { Component, OnInit, Inject } from '@angular/core';
import { OrdersService } from 'app/core/services/orders.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Production_Schedule } from 'app/core/models/index';

@Component({
    selector: 'app-confirm-prod-date',
    templateUrl: './confirm-prod-date.component.html',
    styleUrls: ['./confirm-prod-date.component.scss']
})


export class ConfirmProdDateComponent implements OnInit {
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
    constructor(private ordersService: OrdersService,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.company_id = + this.data.company_id;
        this.order_item_id = + this.data.order_item_id;
        this.quantity = +this.data.quantity;
        this.schedules = this.data.schedules;
        this.selectedIndex = this.data.innerIndex;
        this.index = this.data.index;
        this.lastIndex = this.schedules[this.index].length - 1;
        this.schedule = this.schedules[this.index][this.selectedIndex];
        this.createStatusForm();
    }

    ngOnInit() {

    }

    createStatusForm() {
        this.statusForm = this.fb.group({
            date: [''],
            comment: ['']
        })
    }

    toAddBatchNumMode() {
        //    this.addBatchMode = true;
    }

    updateSchedule() {
        if (this.choose == 'change_date') {
            let tempSchedule = JSON.parse(JSON.stringify(this.schedule));
            tempSchedule.comment = this.statusForm.value.comment;
            tempSchedule.ets_time = this.statusForm.value.date;
            console.log('form date ', this.statusForm.value.date);
            tempSchedule.ifFinish = false;
            tempSchedule.createAt = this.changeDateFormate(new Date);
            tempSchedule.etf_time = this.setEtfDate(tempSchedule);
            let arr = tempSchedule.ets_time.split('-');
            tempSchedule.ets_time = arr[1] + '/' + arr[2] + '/' + arr[0];
            this.schedules[this.index].push(tempSchedule);
            this.status = 1;
            console.log(tempSchedule);
        } else if (this.choose == 'actual_date') {
            this.schedule.ifFinish = true;
            this.schedule.createAt = this.changeDateFormate(new Date);
            this.status = 2;
        }

        return true;
    }

    setEtfDate(tempSchedule) {
        let days = Math.ceil(tempSchedule.production_qty / tempSchedule.prod_rate);
        let startDate = new Date(tempSchedule.ets_time);
        let newdays = new Date(startDate.getTime() + days * 1000 * 60 * 60 * 24);

        let month = this.prepend_0_to_date(newdays.getMonth() + 1);
        let date = this.prepend_0_to_date(newdays.getDate());
        let etf_time_final = month + '/' + date + '/' + newdays.getFullYear();
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
                let data = {
                    est_production_date: JSON.stringify(this.schedules),
                    status: this.status
                };
                this.ordersService.updateOrderItem(this.company_id, this.order_item_id, data).subscribe(
                    (res) => {
                        this.confirmProdDateCallBack = res;
                    }
                )
            }

        }
    }
}

