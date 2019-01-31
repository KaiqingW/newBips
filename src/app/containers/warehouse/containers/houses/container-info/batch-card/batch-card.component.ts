import { OnInit, Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'app/core/services/inventory.service';
import { OrdersService } from 'app/core/services/orders.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
    selector: 'app-batch-card',
    templateUrl:'batch-card.component.html',
    styleUrls:['batch-card.component.scss']
})


export class BatchCardComponent implements OnInit, OnChanges{
    @Input()  orderItemId;
    @Input() containerNum;
    @Input() editMode = false;
    @Output() finishBatchUpdate = new EventEmitter<boolean>();
    shipping;
    company_id : number;
    batchInfos;
    updateBatchForm:FormGroup;
    batches;

    constructor(private warehouseService: WarehouseService,
                private route: ActivatedRoute,
                private ordersService: OrdersService,
                private fb: FormBuilder,
            ){

        this.company_id = +this.route.snapshot.paramMap.get('cid');
        
        if(this.route.snapshot.data.isEditingPage){
            setTimeout(() => {
                let saveBtn = document.getElementById('header-submit-edit');
                    saveBtn.addEventListener('click', ()=> {
                        if(this.updateBatchForm && this.updateBatchForm.valid){
                            this.onSave();
                        }
                    })
            }, 0);
        }
     
    }
    
    ngOnInit(){}

    ngOnChanges(){
        this.getBatchesInfo();
        this.createUpdateBatchForm();
    }

    createUpdateBatchForm(){
        this.updateBatchForm = this.fb.group({
            batches : this.fb.array([])
        });
    }

    createBatch(){
        return this.fb.group({
            actual_quantity:''
        });
    }
    
    addBatch(): void {
        this.batches = this.updateBatchForm.get('batches') as FormArray;
        this.batches.push(this.createBatch());
    }

    getBatchesInfo(){
        this.warehouseService.getBatches(this.company_id, this.orderItemId, this.containerNum).subscribe(
            (res) => {
                this.batchInfos = res.data;
                for(var i = 0; i <this.batchInfos.length;i++){
                    this.addBatch();
                }
            }
        )
    }

    
    onSave(){
        let count = 0;
        for(var i = 0; i< this.batchInfos.length; i++){
            this.warehouseService.updateBatchInfos(this.company_id, this.batchInfos[i].id, this.updateBatchForm.value.batches[i]).subscribe(
                (res) => {
                        count++;
                        if(count === (this.batchInfos.length)){
                            this.finishBatchUpdate.emit(true);
                        }
                }
            )
        }
    }
}