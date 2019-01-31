import { OnInit, Component, DoCheck } from '@angular/core';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Shipping } from 'app/core/models/shipping';
import { Order_Item } from 'app/core/models/order_item';

import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ShippingInfoService } from '../../../../../core/services/shippingInfo.service';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { OrdersService } from '../../../../../core/services/orders.service';

@Component({
    selector: 'app-container-info',
    templateUrl:'container-info.component.html',
    styleUrls:['container-info.component.scss']
})


export class ContainerInfoComponent implements OnInit, DoCheck{
    shipping;
    shippings;
    showNum : number = 2;
    container_name;
    company_id : number;
    editMode: boolean =  false;
    order_item_id;
    updateItemForm;
    items;
    finishBatchUpdate : boolean = false;
    countItemUpdated: number = 0;
    warehouse_id;
    isLoading: boolean = false;
    countAddTransaction : number = 0;
    constructor(private warehouseService: WarehouseService,
                private route: ActivatedRoute,
                private ordersService: OrdersService,
                private fb: FormBuilder,
                private shippingInfoService: ShippingInfoService,
                private location: Location,
                private inventoryService: InventoryService,
                private router: Router
            ){

        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.container_name = this.route.snapshot.paramMap.get('cname');
        this.order_item_id = +this.route.snapshot.paramMap.get('oiId');
        this.warehouse_id= +this.route.snapshot.paramMap.get('wId');
        if(this.route.snapshot.data.isEditingPage){
            this.editMode = true;
            setTimeout(() => {
                let saveBtn = document.getElementById('header-submit-edit');
                    saveBtn.addEventListener('click', ()=> {
                        if(this.updateItemForm && this.updateItemForm.valid){
                            this.onSave();
                        }
                    })
            }, 0);
        }
        this.getContainerDetail();
        this.createUpdateItemsForm();
    }
    
    ngOnInit(){}

    ngDoCheck(){
        if(this.shippings && this.countItemUpdated == (this.shippings.length) && (this.countAddTransaction == this.shippings.length) && this.shippings.length != 0){
            this.countItemUpdated = 0;
            this.location.back();
        }
    }

    switchShowBtn(){
        if(this.showNum == 2){
          this.showNum = 0;
        } else {
          this.showNum = 2;
        }
    }

    createUpdateItemsForm(){
        this.updateItemForm = this.fb.group({
            actual_arrive_date: [''],
            items : this.fb.array([])
        });
    }

    createItem(){
        return this.fb.group({
            qty:''
        });
    }
    
    addItem(): void {
        this.items = this.updateItemForm.get('items') as FormArray;
        this.items.push(this.createItem());
    }

    getContainerDetail(){
        this.warehouseService.getContainerDetail(this.company_id, this.container_name).subscribe(
            (res) => {
                this.shippings = res.data;
                this.shipping = res.data[0];
                this.getItemsInfo();
            }
        )
    }

    getItemsInfo(){
        this.shippings.forEach(
            (shipping) => {
                this.addItem();
                let item_id = +shipping.order_item_id;
                this.ordersService.getOrderItem(this.company_id, item_id).subscribe(
                    (res) => {
                        shipping['product'] = res.product;
                        console.log(this.shippings);
                    }
                )
         
            }
        )
    }
  
    onNavToDetail($event, id){
        let pid = +id;
        $event.stopPropagation();
       
        if(id){
        //   this.router.navigateByUrl(`/company/${this.company_id}/inventory/product/${id}`);
        }
    }

    receivedNotice(event){
        if(event){
            this.finishBatchUpdate = event;
        } 
    }

    onSave(){
        for(var i = 0; i < this.shippings.length; i++){
            let newInfo = {
                actual_arrive_date : this.updateItemForm.value.actual_arrive_date,
                actual_quantity : this.updateItemForm.value.items[i].qty,
                container_number: this.shippings[i].container_number,
                type:this.shippings[i].type
            };
            let count = 0;
            this.shippingInfoService.confirmShippingDate(this.company_id, this.order_item_id, this.shippings[i].id, newInfo).subscribe(
                (res) => {
                    this.countItemUpdated++;
                },
                (err) => {
                    
                },
                () => {
                    // if(this.countItemUpdated == (this.shippings.length)){
                    //     this.location.back();
                    // }
                }
            )

            this.addTransaction(this.updateItemForm.value.items[i].qty, this.shippings[i].product.id);
        }
    }


    addTransaction(qty, product_id){
        let transInfo = {
            warehouse_id: this.warehouse_id,
            product_id: product_id,
            is_import: true,
            amount: qty,
        }
        let isLoading = true;
        this.inventoryService.addTransaction(this.company_id, this.warehouse_id, transInfo).subscribe(
            (res) => {
                this.isLoading = false;
                this.countAddTransaction++;
            }
        )
    }
}