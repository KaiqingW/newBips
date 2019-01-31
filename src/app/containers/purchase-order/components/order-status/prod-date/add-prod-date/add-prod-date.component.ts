import { Component, OnInit, Inject } from '@angular/core';
import { OrdersService } from 'app/core/services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
import { Production_Schedule } from 'app/core/models/index';

@Component({
    selector:'app-add-prod-date',
    templateUrl:'./add-prod-date.component.html',
    styleUrls:['./add-prod-date.component.scss']
})


export class AddProdDateComponent implements OnInit{
    quantity : number;
    company_id: number; 
    order_item_id: number;
    prodDates: string;
    prodDateForm: FormGroup;
    newProdDateCallBack;
    schedules = [];
    schedule : Production_Schedule = new Production_Schedule(false, '', '', 0, 0,'', null);
    production_qty: number;
    restQuantity: number;
    max_qty : number;

    constructor(private ordersService: OrdersService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any){

        this.company_id = + this.data.company_id;
        this.order_item_id = + this.data.order_item_id;
        this.quantity = +this.data.quantity;
        this.max_qty = this.quantity * 1.1;
        this.schedules = this.data.schedules;
        this.createProdDateForm();
        this.caculateRestQty();
    }

    ngOnInit(){

    }

    createProdDateForm(){
        this.prodDateForm = this.fb.group({
            est_production_date: [''],
            production_rate: [''],
            production_qty:[''],
            comment: [''],
            batch_num:['']
        })
    }
    
    caculateRestQty(){
        let qtyInProd = 0;
        this.schedules.forEach(scheduleArr => {
            if(scheduleArr[0].production_qty){
                qtyInProd  += scheduleArr[0].production_qty;
            }
        })
        this.restQuantity = Math.ceil(this.max_qty - qtyInProd);
    }

    setEtfDate(){
        let days = Math.ceil( this.prodDateForm.value.production_qty / this.prodDateForm.value.production_rate);
        let startDate = new Date(this.prodDateForm.value.est_production_date);
        let newdays = new Date ( startDate.getTime() + days * 1000*60*60*24);
        // console.log('newdays', newdays);
        // set production estimate finish date;
        // console.log('month',newdays.getMonth());
        let month = this.prepend_0_to_date(newdays.getMonth() + 1);
        let date = this.prepend_0_to_date(newdays.getDate());
        let etf_time_final = month + '/' + date + '/' +  newdays.getFullYear();
        this.schedule.etf_time = etf_time_final;
    }

    prepend_0_to_date(number){
        if(number < 10){
            return '0' + number;
        }
        return number;
    }
    
    changeDateFormate(date){
        let res = '';
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let secs = date.getSeconds();
        res = this.prepend_0_to_date(month) + '/' + 
              this.prepend_0_to_date(day) + 
             '/' + year + ' at '+ 
             this.prepend_0_to_date(hours) + ':' + 
             this.prepend_0_to_date(minutes) + ':' + 
             this.prepend_0_to_date(secs);

        return res;
    }

    onSave(){
        if(this.prodDateForm.valid){
            this.schedule.prod_rate = this.prodDateForm.value.production_rate;
            this.schedule.ets_time = this.prodDateForm.value.est_production_date;
            let arr = this.prodDateForm.value.est_production_date.split('-');
            this.schedule.ets_time = arr[1] + '/' + arr[2] + '/' + arr[0];
            this.schedule.comment = this.prodDateForm.value.comment;
            this.schedule.createAt = this.changeDateFormate(new Date());
            this.schedule.production_qty = this.prodDateForm.value.production_qty;
            this.setEtfDate();
            this.schedules.push([this.schedule]);

            let data = { 
                est_production_date :JSON.stringify(this.schedules),
                status:1
            };
            this.ordersService.updateOrderItem(this.company_id, this.order_item_id, data).subscribe(
                (res) => {
                    this.newProdDateCallBack =res;
                },
                (err) => {
                }
            )
        }   
    }
}

