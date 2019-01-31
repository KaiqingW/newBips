import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'app/core/services/orders.service';
import { ShippingInfoService } from 'app/core/services/shippingInfo.service';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    FormArray,
    ReactiveFormsModule
  } from "@angular/forms";
import { Location, DatePipe } from '@angular/common';
import { Warehouse } from "../../../../../core/models";
import { WarehouseService } from "../../../../../core/services/warehouse.service";
import { InventoryService } from "../../../../../core/services/inventory.service";


@Component({
    selector:'update-shipped-info',
    templateUrl:'update-shipped-info.component.html',
    styleUrls:['update-shipped-info.component.scss']
})

export class UpdateShippedInfoComponent implements OnDestroy{
    arriveDate;
    arriveDateForm: FormGroup;
    updateBatchForm: FormGroup;
    quantityForm : FormGroup;
    editShippingForm: FormGroup;
    currentShippingInfo;
    currentShippingInfoIndex;
    companyId: number;
    order_item_id:number;
    order_item_shipping_id: number;
    showErr : boolean = false;
    count : number = 0;
    showAddBatch : boolean = false;
    previousTotal = 0;
    bacthErr : boolean = false;
    sales_item_number = '';
    isLoading : boolean = false;
    actual_arrive_date ;
    previous_vessel_date;
    orderItemShippingType: string;
    warehouseForm : FormGroup;
    warehouse: Warehouse;
    warehouseName : string;
    orderCustomerId;
    warehouses;
    next;
    orderId : number;
    title : string;
    select_arrival_title : string;
    isAdmin : boolean = false;
    editMode : boolean = false  ;
    constructor(private route: ActivatedRoute,
                private shippingInfoService: ShippingInfoService,
                private fb: FormBuilder,
                private ordersService: OrdersService,
                private location: Location,
                private warehouseService: WarehouseService,
                private inventoryService: InventoryService){
        
        this.companyId = + this.route.snapshot.paramMap.get('cid');
        this.orderId = +this.route.snapshot.paramMap.get('oId');
        this.order_item_id = +this.route.snapshot.paramMap.get('iId');
        this.order_item_shipping_id = + this.route.snapshot.paramMap.get('sId');
        this.currentShippingInfo = this.shippingInfoService.getSelectedShippingInfo();
        this.checkEditAuth();

        setTimeout(() => {
            let saveBtn = document.getElementById('header-submit-edit');
                saveBtn.addEventListener('click', ()=> {
                    if(this.currentShippingInfo && !this.editMode){
                        this.onSave();
                    }
                    if(this.editMode && this.editShippingForm.valid){
                        this.onSaveEdit();
                    }
                })
        }, 0);

        this.orderItemShippingType = this.shippingInfoService.getOrderItemShippingType();
        console.log(this.orderItemShippingType);
        console.log(this.currentShippingInfo);
        this.getTitle();
        this.getOrderInfo();
        // alert(this.orderItemShippingType);
        // alert(new DatePipe('en-US').transform(JSON.parse(JSON.stringify(this.currentShippingInfo.vessel_date)), 'yyyy-MM-dd'));

        // this.previous_vessel_date = new DatePipe('en-US').transform(JSON.parse(JSON.stringify(this.currentShippingInfo.vessel_date)), 'yyyy-MM-dd');
        // there has bug
        let newTime = new Date(JSON.parse(JSON.stringify(this.currentShippingInfo.vessel_date)));
        // let newTime = new Date(this.currentShippingInfo.vessel_date).toJSON().split('T')[0]
        this.previous_vessel_date = newTime.getFullYear() + '-' + newTime.getMonth() + '-' + newTime.getDate();

        if(this.currentShippingInfo.actual_arrive_date){
            this.actual_arrive_date = this.currentShippingInfo.actual_arrive_date;
        } 
        this.showAddBatch = this.evaluateIfShowBatch();
        this.currentShippingInfoIndex = this.shippingInfoService.getCurrentShippingInfoIndex();
        if(this.shippingInfoService.getCurrentItem()){
            this.sales_item_number = this.shippingInfoService.getCurrentItem().sales_item_number;
        }
        this.createArriveDateForm();
        this.createUpdateBatchForm();
        this.createQuantityForm();
        if(this.currentShippingInfo.warehouses.length == 0){
            this.createWarehouseForm();
        }
        this.getWarehouses();
    }

    checkEditAuth(){
        this.ordersService.checkEditOrderStatusAuth(this.companyId, this.orderId).subscribe(
          res => {
              this.isAdmin = res.auth;
          }
        )
    }
    
    onSaveEdit(){
        this.isLoading = true;
        this.shippingInfoService.confirmShippingDate(this.companyId, this.order_item_id, this.order_item_shipping_id, this.editShippingForm.value).subscribe(
            (res) => {
                this.isLoading = false;
                this.location.back();
            },
            (err) => {
                this.showErr = true;
            }
        )
    }

    getTitle(){
        if(this.orderItemShippingType == 'ocean'){
            this.title = 'Update Ocean Freight Shipping';
            this.select_arrival_title = "Please select Ocean Freight Shipping Arrival Date to Port. For purchase order number"; 
        } else if (this.orderItemShippingType == 'air'){
            this.title = 'Update Air Shipping';
            this.select_arrival_title = "Please select Air Shipping Arrival Date. For purchase order number"; 
        } else if (this.currentShippingInfo.type == 2){
            this.title = 'Update Customs Clearnce';
            this.select_arrival_title = "Please select Customs Clearance Finish Date. For purchase order number"; 
        } else if(this.currentShippingInfo.type == 3){
            this.title = 'Update Ground Shipping';
            this.select_arrival_title = "Please select Ground Shipping Arrival Date. For purchase order number"; 
        } else if(this.currentShippingInfo.type == 4){
            this.title = 'Update Final Shipping Information';
            this.select_arrival_title = "Please select Final Shipping Arrival Date. For purchase order number"; 
        }
    }

    ngOnDestroy(){
        this.ordersService.setPdId(0);
    }

    getOrderInfo(){
        this.ordersService.getOrderDetail(this.companyId, this.orderId).subscribe(
            (res) => {
                this.orderCustomerId = res.customer;
            }
        )
    }

    getWarehouses(){
        this.isLoading = true;
          this.warehouseService.getWarehouseCollection(this.companyId).subscribe(
              (res) => {
                  this.isLoading = false;
                  this.warehouses = res.data;
  
                  if(res.paging.next){
                    this.next = res.paging.next;
                    this.getPagingWarehouses();
                  } 
              },
              (err) => {
                this.isLoading = false;
  
              }
          )
      }
  
      getPagingWarehouses(){
          this.isLoading = true;
          this.warehouseService.getNextWarehouses(this.next).subscribe(
            (res) => {
              this.isLoading = false;
              this.warehouses = this.warehouses.concat(res.data);
             
              if(res.paging.next){
                this.next = res.paging.next;
                this.getPagingWarehouses();
              } 
            },
            (err) => {
  
            }
          )  
      }
  
    createArriveDateForm(){
        this.arriveDateForm = this.fb.group({
            actual_arrive_date: [""]
        });
    }

    createWarehouseForm(){
        this.warehouseForm = this.fb.group({
            warehouse_id:[""]
        })
    }
    
    createUpdateBatchForm(){
        this.updateBatchForm = this.fb.group({
            batches : this.fb.array([])
        })
    }

    createQuantityForm(){
        this.quantityForm = this.fb.group({
            actual_quantity: this.currentShippingInfo.actual_quantity
        });
    }
    changeEditMode(){
        this.editMode = !this.editMode;
        this.createEditShippingForm();
    }

    createEditShippingForm(){
        this.editShippingForm = this.fb.group({
            quantity: [this.currentShippingInfo.quantity, [Validators.required]],
            // actual_quantity:[0],
            container_number: [this.currentShippingInfo.container_number],
            vessel_date: [this.changeDateFormat(this.currentShippingInfo.vessel_date)],
            eta_date: [this.changeDateFormat(this.currentShippingInfo.eta_date)],
            // actual_arrive_date: [''],
            glk_number: [this.currentShippingInfo.glk_number],
            // status:[''],
            // type: []
        });
    }

    changeDateFormat(date){
        return date.substring(0,10);
    }

    initBatch(){
        return this.fb.group({
            batch_num: [''],
            qty:[''],
        })
    }

    addBatch(){
        const control = <FormArray>this.updateBatchForm['controls'].batches;
        control.push(this.initBatch());
    }

    removeBatch(i: number){
        const control = <FormArray>this.updateBatchForm['controls'].batches;
        control.removeAt(i);
    }

    evaluateIfShowBatch(){
        let total = this.currentShippingInfo.quantity;    
        this.previousTotal = 0;
        if(this.currentShippingInfo && this.currentShippingInfo.batches){
            this.currentShippingInfo.batches.forEach((batch) => {
                return this.previousTotal += batch.quantity; 
            });
            if(total > this.previousTotal){
                return true;
            }
        }
        return false;
    }

    evaluateBatchQty(){
        let total = this.currentShippingInfo.quantity;
        let batchTotal = 0;
        this.updateBatchForm.value.batches.forEach((batch) => {
            batchTotal += batch.qty;
        });

        if(total >= (batchTotal+this.previousTotal)){
            return true;
        }
        return false;
    }

    createNextShipProcess(){
        
        let newInfo = JSON.parse(JSON.stringify(this.currentShippingInfo));
        newInfo.status = 'processing',
        newInfo.actual_arrive_date = '';
        newInfo.vessel_date = this.currentShippingInfo.actual_arrive_date;
        // let newTime = new Date(this.currentShippingInfo.actual_arrive_date).getTime() + 1000*60*60*24*3;
        // newInfo.eta_date = new DatePipe('en-US').transform(newTime, 'yyyy-MM-dd');
        let newTime = new Date(new Date(this.currentShippingInfo.actual_arrive_date).getTime() + 1000*60*60*24*3);

        if(this.currentShippingInfo && this.currentShippingInfo.type){
            if(this.currentShippingInfo.type == 3){
                newInfo.eta_date = this.currentShippingInfo.actual_arrive_date;
            } else {
                let month = newTime.getMonth()+1;
                newInfo.eta_date = newTime.getFullYear() + '-' + month + '-' + newTime.getDate();
            }
        } 
        
        newInfo.type += 1;
        if(newInfo.type === 4){
            newInfo.status = 'finish';
        }

        this.shippingInfoService.addShippingInfo(this.companyId, this.order_item_id, newInfo).subscribe(
            (res) => {
                if(!this.showAddBatch || (this.updateBatchForm.value.batches.length == 0)){
                    this.location.back();
                }
            },
            (err) => {
                console.log('err');
            }
        )    
    }


    uploadShipping(){
        this.currentShippingInfo.actual_arrive_date = this.arriveDateForm.value.actual_arrive_date;
        
        let newInfo = {
            actual_arrive_date : this.arriveDateForm.value.actual_arrive_date,
            container_number: this.currentShippingInfo.container_number,
            type:this.currentShippingInfo.type,
            status: "finish"
        };
        this.isLoading = true;
        this.shippingInfoService.confirmShippingDate(this.companyId, this.order_item_id, this.order_item_shipping_id, newInfo).subscribe(
            (res) => {
                this.isLoading = false;
                if(this.currentShippingInfo.actual_arrive_date  && (this.currentShippingInfo.type != 4)){
                    this.createNextShipProcess();
                } else {
                    if(!this.showAddBatch || (this.updateBatchForm.value.batches.length == 0)){
                        this.location.back();
                    }
                }
               
            },
            (err) => {
                this.showErr = true;
            }
        )
    }

    uploadBatchInfo(batchInfo){
        this.isLoading = true;
        this.shippingInfoService.addBatch(this.companyId, this.order_item_shipping_id, batchInfo).subscribe(
            (res) => {
                this.isLoading = false;
                this.count++;
            },
            (err) => {
                this.bacthErr = true;
            },
            () => {
                this.isLoading = false;
                if(this.count === this.updateBatchForm.value.batches.length){
                    this.location.back();
                }
            }
        )
    }

    // updateReceivedQty(){
    //     let newInfo = {
    //         container_number: this.currentShippingInfo.container_number,
    //         type:this.currentShippingInfo.type,
    //         actual_quantity : this.quantityForm.value.actual_quantity
    //     };

    //     this.shippingInfoService.confirmShippingDate(this.companyId, this.order_item_id,this.order_item_shipping_id, newInfo).subscribe(
    //         (res) => {
    //             this.isLoading = false; 
    //         },
    //         (err) => {
    //             this.showErr = true;
    //         }
    //     )
    // }

    onSave(){
        if(this.evaluateBatchQty()){
            if(this.updateBatchForm.valid){
                this.uploadShipping();
                this.updateBatchForm.value.batches.forEach((batch) => {
                    let batchInfo = {
                        quantity: batch.qty,
                        container_number: this.currentShippingInfo.container_number,
                        vessel_date: this.currentShippingInfo.vessel_date,
                        eta_date: this.currentShippingInfo.eta_date,
                        glk_number: this.currentShippingInfo.glk_number,
                        status: "finish",
                        batch_number: batch.batch_num
                    };
                    this.uploadBatchInfo(batchInfo);
                })
            } else {
                this.showErr = true;
            }

        } else {
            this.bacthErr = true;
        }

        // if((this.currentShippingInfo.type === 4) && this.quantityForm.valid){
        //     this.updateReceivedQty();
        // }
        if((this.orderCustomerId == null) && this.warehouseForm.valid && this.warehouseForm.value.warehouse_id){
                // this.addTransaction();
                this.assignWarehouse();              
        }
    }



    assignWarehouse(){
        let newInfo = {
            warehouse_id: this.warehouseForm.value.warehouse_id
        };
        let isLoading = true;
        this.ordersService.asignShippingWarehouse(this.companyId, this.currentShippingInfo.id, newInfo).subscribe(
            (res) => {
                this.isLoading = false;
            }
        )
    }
    
    addTransaction(){
        let transInfo = {
            warehouse_id: this.warehouseForm.value.warehouse_id,
            product_id: this.ordersService.getPdId(),
            is_import: true,
            amount: this.quantityForm.value.actual_quantity,
        }
        let isLoading = true;
        this.inventoryService.addTransaction(this.companyId, this.warehouseForm.value.warehouse_id, transInfo).subscribe(
            (res) => {
                this.isLoading = false;
            }
        )
    }

    updateTransaction(){
        let transInfo = {
            warehouse_id: this.warehouseForm.value.warehouse_id,
            product_id: this.ordersService.getPdId(),
            is_import: true,
            amount: this.quantityForm.value.actual_quantity,
        }
        let isLoading = true;
        this.inventoryService.addTransaction(this.companyId, this.warehouseForm.value.warehouse_id, transInfo).subscribe(
            (res) => {
                this.isLoading = false;
            }
        )
    }

}