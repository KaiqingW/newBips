import { Component, OnInit, Inject } from '@angular/core';
import { OrdersService } from 'app/core/services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Production_Schedule } from 'app/core/models/index';

@Component({
    selector:'add-production-subject',
    templateUrl:'./add-production-subject.component.html',
    styleUrls:['./add-production-subject.component.scss']
})


export class AddProductionSubjectComponent implements OnInit{
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
                private dialogRef: MatDialogRef<AddProductionSubjectComponent>,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any){

        this.company_id = + this.data.company_id;
        this.order_item_id = + this.data.order_item_id;
        this.quantity = +this.data.quantity;
        this.max_qty = this.quantity * 1.1;
        this.schedules = this.data.schedules;
        console.log(this.schedules);
        this.createProdDateForm();
        this.caculateRestQty();
    }

    ngOnInit(){

    }

    createProdDateForm(){
        this.prodDateForm = this.fb.group({
            ets_time: [''],
            etf_time:[''],
            prod_rate: [''],
            production_qty:[''],
            comment: [''],
            batch_num:['']
        })
    }
    
    caculateRestQty(){
        let qtyInProd = 0;
        console.log(this.schedules);
        this.schedules.forEach(scheduleArr => {
            console.log(qtyInProd);
            if(scheduleArr.schedules[scheduleArr.schedules.length - 1].production_qty){
                qtyInProd  += scheduleArr.schedules[scheduleArr.schedules.length - 1].production_qty;
            }
        })
        this.restQuantity = Math.ceil(this.max_qty - qtyInProd);
        console.log(this.restQuantity);
    }

    setEtfDate(){
        let days = Math.ceil( this.prodDateForm.value.production_qty / this.prodDateForm.value.prod_rate);
        let startDate = new Date(this.prodDateForm.value.ets_time);
        let newdays = new Date ( startDate.getTime() + days * 1000*60*60*24);
    
        let month = this.prepend_0_to_date(newdays.getMonth() + 1);
        let date = this.prepend_0_to_date(newdays.getDate());
        let etf_time_final = newdays.getFullYear() + '-' + month + '-' + date;
        this.schedule.etf_time = etf_time_final;
    }

    prepend_0_to_date(number){
        if(number < 10){
            return '0' + number;
        }
        return number;
    }

    onSave(){
        if(this.prodDateForm.valid){
            this.schedule.prod_rate = this.prodDateForm.value.prod_rate;
            this.schedule.ets_time = this.prodDateForm.value.ets_time;
            this.schedule.comment = this.prodDateForm.value.comment;
            this.schedule.production_qty = this.prodDateForm.value.production_qty;
            this.setEtfDate();
            
            this.ordersService.addProdcutionSubject(this.company_id, this.order_item_id, this.schedule).subscribe(
                (res) => {
                    this.newProdDateCallBack =res;
                    this.dialogRef.close(this.newProdDateCallBack);
                },
                (err) => {
                }
            )
        }   
    }
}

